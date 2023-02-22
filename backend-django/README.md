### Running project

**First time only:**  
You need to create an **env** folder, copy file **env.example** (from **code_project** directory) inside it with name dev.env or staging.env, and update values accordingly (for example, put DJANGO_SETTINGS_MODULE=init_project.settings for development).

For image creation, execute
`docker-compose -f dev.yml up`  
note: wait for a message containing 'Creating database challenger' (it may take more than 90 seconds to appear)

**Later:**  
For stop containers (and not require image creation again):  
`docker-compose -f dev.yml stop`

For start containers (using existing image):  
`docker-compose -f dev.yml start`

For console access in Django project container:  
`docker-compose -f dev.yml exec challenger_back /bin/bash`
`or`
`docker-compose -f dev.yml exec challenger_back //bin//bash`
then, execute commands  
`python manage.py collectstatic --no-input`  
`python manage.py makemigrations`  
`python manage.py migrate`  
`python manage.py runserver 0.0.0.0:8000`
create super user
`python manage.py createsuperuser`
create requirements.txt
`pip freeze > requirements.txt`

When requirements file change (then, create the image again):
`docker-compose -f dev.yml up --build`

### Notes:

To see database information, access to http://localhost:8080 with:
POSTGRES_DB=challenger
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
DB_HOST=challenger_db

To access to API documentation in `swagger/`, make login via `admin/` first (access is restricted to authenticated users)
