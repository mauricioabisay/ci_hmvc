FROM php:5-apache
RUN apt-get update -y && apt-get install -y libmcrypt-dev openssl
RUN docker-php-ext-install mysqli pdo pdo_mysql mbstring
COPY . /var/www/html