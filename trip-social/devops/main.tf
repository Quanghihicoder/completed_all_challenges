terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-2"
}   

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

data "aws_availability_zone" "sydney" {
  name = "ap-southeast-2b"
}


resource "aws_vpc" "xo_game_server" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "xo_game_server_vpc"
  }
}


resource "aws_subnet" "xo_game_server_subnet_public" {
  vpc_id            = aws_vpc.xo_game_server.id
  availability_zone = data.aws_availability_zone.sydney.name
  cidr_block        = "10.0.1.0/24"

  tags = {
    Name = "xo_game_server_subnet_public"
  }
}

resource "aws_internet_gateway" "xo_game_server" {
  vpc_id = aws_vpc.xo_game_server.id

  tags = {
    Name = "xo_game_server_igw"
  }
}

resource "aws_route_table" "xo_game_server_rtb_public" {
  vpc_id = aws_vpc.xo_game_server.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.xo_game_server.id
  }

  tags = {
    Name = "xo_game_server_rtb_public"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.xo_game_server_subnet_public.id
  route_table_id = aws_route_table.xo_game_server_rtb_public.id
}

resource "aws_network_acl" "xo_game_server_nacl" {
  vpc_id = aws_vpc.xo_game_server.id

  subnet_ids = [ aws_subnet.xo_game_server_subnet_public.id ]

  ingress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 443
    to_port    = 443
  }

  ingress {
    protocol   = "tcp"
    rule_no    = 101
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 80
    to_port    = 80
  }

  ingress {
    protocol   = "tcp"
    rule_no    = 102
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 22
    to_port    = 22
  }

  ingress {
    protocol   = "tcp"
    rule_no    = 103
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 32768
    to_port    = 65535
  }


  ingress {
    protocol   = "tcp"
    rule_no    = 104
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 8000
    to_port    = 8000
  }

  egress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 65535
  }

  tags = {
    Name = "xo_game_server_nacl"
  }
}

resource "aws_security_group" "xo_game_server" {
  name        = "XO Game Sever Security Group"
  description = "Security group for the xo game server"
  vpc_id      = aws_vpc.xo_game_server.id

  tags = {
    Name = "XO Game Sever Security Group"
  }
}

resource "aws_vpc_security_group_ingress_rule" "xo_game_server_allow_https" {
  security_group_id = aws_security_group.xo_game_server.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "xo_game_server_allow_http" {
  security_group_id = aws_security_group.xo_game_server.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "xo_game_server_allow_webserver" {
  security_group_id = aws_security_group.xo_game_server.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 8000
  to_port           = 8000
}

resource "aws_vpc_security_group_ingress_rule" "xo_game_server_allow_ssh" {
  security_group_id = aws_security_group.xo_game_server.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
}

resource "aws_vpc_security_group_egress_rule" "xo_game_server_allow_all" {
  security_group_id = aws_security_group.xo_game_server.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}


resource "aws_instance" "xo_game_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.small"

  associate_public_ip_address = true
  subnet_id = aws_subnet.xo_game_server_subnet_public.id
  vpc_security_group_ids = [ aws_security_group.xo_game_server.id ]

  user_data = templatefile("setup_server.sh", { 
    domain_name = var.domain_name ,
    email = var.email
    github_url = var.github_url
  })

  key_name = var.key_name

  tags = {
    Name = "xo_game_server_instance"
  }
}

resource "aws_route53_record" "web" {
  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_instance.xo_game_server.public_ip]
}


# Output ALB URL
output "xo_game_server_url" {
  description = "URL of the XO Game Server"
  value       = "https://${var.domain_name}"
}
