from .models import Users


def get_avatar(backend, strategy, details, response, user=None, *args, **kwargs):
    url = None
    '''if backend.name == 'facebook':
        url = "http://graph.facebook.com/%s/picture?type=large"%response['id']
    if backend.name == 'twitter':
        url = response.get('profile_image_url', '').replace('_normal','')'''
    if backend.name == 'google-oauth2':
        url = response['image'].get('url')
        url = url.split('.')[-1]
    if url:
        Users.avatar = url
        Users.save()
