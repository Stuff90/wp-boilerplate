# Faena



## Installation

#### Vhost setup

Run the following `cmd`:
```bash
sudo vi /etc/hosts
```
Then add the following line at the end of the file:
```
127.0.0.1   com.faena
```

Open `/Applications/MAMP/conf/apache/extra/httpd-vhosts.conf` and add the following vhost :

```
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host2.example.com
    DocumentRoot "/Applications/MAMP/htdocs/faena"
    ServerName com.faena
    ErrorLog "/Applications/MAMP/logs/faena-error.log"
    CustomLog "/Applications/MAMP/logs/faena-access.log" common
</VirtualHost>
```
Then restart MAMP.
#### Database connection
Use the file `wp-config.php` from Slack 

#### Development environement
Run the following `cmd` to install npm & bower dependencies, generate the proper gulpfile and start the watch on project:
```bash
npm run dev
```
#### Production environement

Run the following `cmd` to install npm & bower dependencies, generate the project and minify sources:
```bash
npm run prod
```
