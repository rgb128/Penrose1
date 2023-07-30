docker stop pentose1c
docker rm pentose1c

docker build -t pentose1i:v1 .\

docker run -p 0.0.0.0:8080:8080 --name pentose1c -v %cd%\src:/app pentose1i:v1
