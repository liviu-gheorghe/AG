FROM ubuntu:18.04


#Install nginx and Python dependencies

RUN apt-get update && \
apt-get install -y nginx \
python3 \
python-dev \
libpq-dev \
python3-pip && \
pip3 install \
djangorestframework \
django-cors-headers \
requests \
Pillow \
uwsgi 


RUN easy_install psycopg2


#Copy nginx configuration file
COPY ag_api.conf /etc/nginx/sites-available/
#Create symlink in sites-enabled directory
RUN ln -s /etc/nginx/sites-available/ag_api.conf /etc/nginx/sites-enabled/ag_api.conf 
#Copy application in opt directory
COPY . /opt/API/


#Change working directory to /opt/API
WORKDIR /opt/API
#Start nginx and uwsgi service using shell form
CMD service nginx start && uwsgi --socket :8001 --wsgi-file API/wsgi.py
#Expose port 8000
EXPOSE 8000

#Add environment variables
ENV CONTAINER_NUMBER 1
ENV PRODUCTION false

