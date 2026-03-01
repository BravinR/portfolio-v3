---
title: Experience building Teamsphere
author: Bravin Rutto 
date: "2025-07-13"
tags: [Infra, Programming]
description: "What I learnt building and shipping code in a collaborative codebase"
---
I couldn't afford Slack, so I thought, "Why not clone it?". If you know me you will realise I love cloning things. 

Initially, the architecture was incredibly simple: just Java code and a database. Why we chose Java still baffles me, but my employer had me working with Java Spring Boot for over 40 hours a week. So, for Tenet and me, choosing Java seemed like a no-brainer. Or perhaps it was because Tenet had already scaffolded the project in Java using Spring Boot. To be honest, we never really sat down and discussed whether we should use Java and MySQL. I just picked up the project and started adding features. In hindsight, we should've spent more time ironing out the architecture.

We spent so much time fixing authentication—and full disclosure, we still have an issue open to move to a managed service, or OpenAuth. I hate auth. There are so many moving parts and so many ways to mess it up. Thanks to rolling our own authentication, I now know to never build it myself again.

It wasn't long before I got bored of fixing auth and decided to work on the frontend. Years before I started this project, I was a big React fan. Well, maybe "fan" isn't the right word, but the abundance of YouTube tutorials made it easy for a beginner to pick up. So, choosing React for the frontend was an obvious choice. You might think we were done making decisions, but you'd be wrong. I still needed to choose a React framework. The only one I'd worked with was Next.js, but unlike our other decisions, I didn't want to use Next.js for this project. Having built my personal website with Next.js, I really disliked it and was looking for something simpler.

It was at this point that I discovered Vite. It was minimal and incredibly simple to pick up. I loved it! That is, until it was time to deploy. I couldn't just throw it in a Docker container like I could with Next.js. I knew how to use Nginx, so I just let Nginx serve the HTML, CSS, and JavaScript that Vite's build step produced.

At this stage, I decided to deploy the rest of the code (the backend). I Dockerized everything and got to work writing the ```docker-compose``` file for all the services we needed: RabbitMQ, MySQL, Nginx, and the Spring app.

Seems easy, right? Or rather, it seems like we were done. Well, jokes on you—this was just the beginning of realizing we were nowhere near production-ready. I was solving problems as I went. When the app deployment failed, I'd just run  docker compose logs app  . This worked until Tenet asked if he could take a look, and I realized I couldn't just give him access to the server. I needed a way to show him the logs. So, at this point, we added Promtail, Loki, and Grafana to be able to view the logs. You can see how the complexity kept growing.

This setup worked for a few days until we realized the frontend needed SSL certificates. "No problem," I thought, and added a Certbot Docker container. This served us really well until the certificates expired 90 days later. I needed to regenerate them and restart Nginx so it would pick up the new certificates. At this point, I realized the pain of doing this manually, but I didn't do anything about it since it was already done by the time I acknowledged the pain. Fast forward another 90 days, and the certs expired again. Well, enough was enough. I removed the Certbot service from docker-compose and just ran it as a systemd process. This allowed for auto-renewal of certificates. This still works to this day, two years later, but it had a side effect.

Up to this point, we were using Git to track all infrastructure changes, but I had sneaked in a systemd process that we couldn't track. Now we had to remember it, and I'm super forgetful.

Let's circle back to the point where we decided to make our infrastructure repository public. Until this point, we were storing all secrets in the docker-compose.yaml file. But since we take security seriously, I decided to rethink how we could do this correctly without exposing secrets to the public internet. At work, my employer uses HashiCorp Vault to store secrets, so it was an obvious choice to do the same. I created DigitalOcean VMs to experiment with this. From the start, it was clear I'd need two instances: one for development and one for production. Once this was done, we were able to open-source the infrastructure deployment code.

This worked for 18 months, but as you can see, nothing in the architecture is truly reproducible.


It wasn't long enough I got bored of fixing auth and decided to work on the frontend. Years before I picked this project I was a big react fan. Wait wait I am not a fan but the existence of a lot of youtube videos on react made it easy to pick as a begginer. So it wasn't a no brainer to pick react for the frontend. You might think we are done with making decisions but you would be wrong. I needed to chose a react framework. Well the only react framework I had worked with was nextjs but unlike the other decisions so far I didn't want to used Nextjs for this project. Having wrote my personal website in Nextjs I hate Nextjs and I was looking for something so simple. 
It was at this point I learnt about Vite. It was minimal and very simple to pick up I loved it. Well until time to deploy it. I couldn't just put in a docker container like you would nextjs. 

I knew how to use nginx so I just let nginx serve the html, css and javascript that the build step of Vite produces. 

It was at this point I decided to deploy the rest of the code ( backend code) I dockerised everything and went to town to write the docker compose for all the services we needed (rabbitMQ, MySQL, Nginx, Spring app)
Seems easy right or I should say it seems we are done. Well jokes on you this was just the beginning of realizing we were no where near being production ready. I was solving things as I went so when the app deploymemt failed I would  docker compose logs app This worked until Tenet asked if he could help take a look and I realized I couldn't just give him access to the server I need a way to show him logs. So it was this point we added promtail, loki and grafana to be able to view the logs. You can see how the complexity kept growing.

This worked for a few days until we realized the frontend needed ssl certificates. No problem add certbot docker container. This served us really well until the certs expired 90 days later. I needed to regenerate certificates. Restart nginx so that it picks the new certs. At this point I realized the pain of doing this manually but I didn't do anything about since by the time I realized it was painful it was done. Fast forward 90 days later and the certs expired. Well enough is enough. I removed the certbot service from the docker compose and just ran it a systemd process this allowed for auto renewal of certs. This stills works to this day 2 years later but this had a side effect

Up to this point we were using git to track all the infra changes but I have sneaked in a systemd process that we can't track so now we have to remember it. And do I tell you I am super forgetful. 

Well lets cycle back to the point where we decided to make infra repo public. Upto to this point we were storing all secrets in the docker compose yaml. But since we take security seriously. I decided to rethink of how we could do this correctly without exposing secrets to the public internet. At work my employer uses hashi vault to store secrets so It was a no brainer to do the same. I created Digital Ocean VMs to play around with this. In the beginning it was clear I would need 2 instances dev and prod. When this was done we were able to open source the infra-deployment code. 

This worked for 18 months but you can see nothing in the architecture is reproducable. 

I think it is time we revisit and this time I will actually think hard of how all these components fit together. 