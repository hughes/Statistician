from django.db import models
import uuid
from hashlib import sha1
import hmac
from django.template.defaultfilters import slugify

class Project(models.Model):
    name = models.CharField(max_length=255)
    key = models.CharField(max_length=100)
    slug = models.SlugField()

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        self.slug = slugify(self.name)
        return super(Project, self).save(*args, **kwargs)

    def generate_key(self):
        #shamelessly lifted from django-tastypie ApiKey
        # Get a random UUID.
        new_uuid = uuid.uuid4()
        # Hmac that beast.
        return hmac.new(str(new_uuid), digestmod=sha1).hexdigest()

class ExceptionLog(models.Model):
    project = models.ForeignKey(Project)
    exception_type = models.CharField(max_length=100)
    exception_value = models.CharField(max_length=255)

class Traceback(models.Model):
    project = models.ForeignKey(Project)
    trace = models.TextField()

class Request(models.Model):
    project = models.ForeignKey(Project)
    timestamp = models.DateTimeField()
    username = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    url = models.CharField(max_length=1000)
    status = models.IntegerField()
    time = models.FloatField()
    exception_log = models.ForeignKey(ExceptionLog, null=True)
    traceback = models.ForeignKey(Traceback, null=True)
    hostname = models.CharField(max_length=100)