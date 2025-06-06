variable "key_name" {
  description = "SSH key pair name for EC2 instance access"
  type        = string
}

variable "email" {
  description = "Email for the SSL certificate"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the SSL certificate"
  type        = string
}

variable "github_url" {
  description = "Domain name for the SSL certificate"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route 53 Hosted Zone ID for domain validation"
  type        = string
}
