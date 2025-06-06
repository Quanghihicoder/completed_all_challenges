# Surrender

I plan to develop an OAuth2 proxy that only requires changes to the docker-compose and nginx.conf files.

Without modifying the backend code, I’m unsure how to link the current authentication system with an OAuth2 proxy.

It's also somewhat broken — even though I’ve added depends_on, the auth-proxy still starts too early and crashes, which causes NGINX to crash as well. I have to restart them manually.

It feels like it’s almost working, but not quite complete.

Reference:
http://morganridel.fr/authentication-for-multiple-apps-behind-a-reverse-proxy

===============================

I’m not even sure if this is the right approach to solve the problem — it just feels like it might be.

I also found discussions online about JWT-based solutions, but most of them require significant changes to the backend code.
