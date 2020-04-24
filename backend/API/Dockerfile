FROM ubuntu:18.04


#Install nginx and Python dependencies

RUN apt-get update && \
apt-get install -y nginx \
python3 \
python3-pip && \
pip3 install \
djangorestframework \
django-cors-headers \
requests \
Pillow \
uwsgi 

RUN pip3 install psycopg2-binary
RUN apt-get install -y python-dev libpq-dev



#Copy nginx configuration file
COPY ag_api.conf /etc/nginx/sites-available/
#Create symlink in sites-enabled directory
RUN ln -s /etc/nginx/sites-available/ag_api.conf /etc/nginx/sites-enabled/ag_api.conf 
#Copy application in opt directory
COPY . /opt/API/


#Change working directory to /opt/API
WORKDIR /opt/API

#RUN python3 manage.py makemigrations && python3 manage.py migrate


#Start nginx and uwsgi service using shell form
#Expose port 8000
EXPOSE 8000



#Add environment variables
ENV CONTAINER_NUMBER 1
ENV PRODUCTION false
ENV EVALUATION_CONTAINER_HOST http://evaluator:8080
ENV DATABASE_HOST database
ENV DATABASE_PASSWORD secret_password
#Advanced Romanian Engineering technique
RUN sleep 10

#CMD python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000
CMD service nginx start && uwsgi --socket :8001 --wsgi-file API/wsgi.py