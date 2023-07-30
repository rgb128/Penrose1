docker stop pentose1c
docker rm pentose1c

docker build -t pentose1i:v1 .\

@REM docker run -d -p 0.0.0.0:8080:8080 --name pentose1c -v %cd%\src:/app/src -v %cd%\node_modules:/app/node_modules pentose1i:v1
docker run -p 8080:8080 --name pentose1c -v %cd%\src:/app/src -v %cd%\src\node_modules:/app/node_modules pentose1i:v1
