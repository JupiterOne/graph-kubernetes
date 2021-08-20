os.putenv('TILT_CACHE_DIR', os.path.abspath('./.tilt-cache'))

load('ext://secret', 'secret_yaml_generic')

docker_build('graph-kubernetes', '.')
k8s_yaml('tilt.yml')
