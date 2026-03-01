---
title: Deploy VS Code Code Server to Dokku
author: Bravin Rutto 
date: "2025-07-14"
tags: [Infra, Deployment, Dokku]
description: "How Deploy code server to a VPS using Dokku."
---
SSH into the Dokku host and create the application as follows:
```bash
# on the Dokku host
dokku apps:create codeserver
```
Point the application container to the git repository
```bash
dokku git:sync codeserver https://github.com/BravinR/code-server.git
```
dokku ps:rebuild codeserver
Expose port 80 of the Dokku host to port 8080 of the codeserver container
```bash
dokku ports:add codeserver http:80:8080
```
To enable HTTPS, set your email address for Let's Encrypt
```bash
dokku letsencrypt:set codeserver email your@email.tld
```
Finally, enable Let's Encrypt for your codeserver application to provision a free SSL certificate:
```bash
dokku letsencrypt:enable codeserver
```
Your VS Code Code Server should now be accessible via HTTPS at the Dokku application's URL.