F:\MyCodeBase\openssl-0.9.8k_WIN32\bin\openssl.exe genrsa 1024 > private.key

F:\MyCodeBase\openssl-0.9.8k_WIN32\bin\openssl.exe req -new -key private.key -out cert.csr -config F:\MyCodeBase\openssl-0.9.8k_WIN32\openssl.cnf


F:\MyCodeBase\openssl-0.9.8k_WIN32\bin\openssl.exe x509 -req -in cert.csr -signkey private.key -out certificate.pem