---
title: Experience building Teamsphere
author: Bravin Rutto 
date: "2025-07-13"
tags: [Infra, Programming]
description: "What I learnt building and shipping code in a collaborative codebase"
---
I couldn't afford Slack, so I thought, "Why not clone it?". If you know me you will realise I love cloning things. 

Initially, the architecture was incredibly simple: just Java code and a database. Why we chose Java still baffles me, but my employer had me working with Java Spring Boot for over 40 hours a week. So, for Tenet and me, choosing Java seemed like a no-brainer. Or perhaps it was because Tenet had already caffolded the project in Java using Spring Boot. We never really sat down and discussed whether we should use Java and MySQL. I just picked up the project and started adding features. In hindsight, we should've spent more time ironing out the architecture.

We spent so much time fixing authentication and full disclosure, we still have an issue open to move to a managed service or OpenAuth. I hate auth. There are too many moving parts and too many ways to mess it up. Thanks to rolling our own authentication, I now know to never build it myself again.

It wasn't long enough, I got bored of fixing auth and decided to work on the frontend. Years before I picked this project, I was a big React fan. Wait, wait, I am not a fan, but the existence of a lot of YouTube videos on React made it easy to pick as a beginner. So it wasn't a no-brainer to pick React for the frontend. You might think we are done with making decisions, but you would be wrong. I needed to choose a React framework.The only one I'd worked with was Next.js, but unlike our other decisions, I didn't want to use Next.js for this project. Having built my personal website with Next.js, I really disliked it and was looking for something simpler

It was at this point that I discovered Vite. It was minimal and incredibly simple to pick up. I loved it! That is, until it was time to deploy. I couldn't just throw it in a Docker container as I could with Next.js. I knew how to use Nginx, so I just let Nginx serve the HTML, CSS, and JavaScript that Vite's build step produced.

It was time to tackle the backend deployment. I Dockerized the application and began writing everything together in a Docker Compose file, bringing up the full stack: RabbitMQ, MySQL, Nginx, and the Spring app.

Seems easy, right? Or rather, it seems like we were done. Well, jokes on you, this was just the beginning of realizing we were nowhere near production-ready. I was solving problems as I went. When the app deployment failed, I'd just run docker compose logs app. This worked until Tenet asked if he could take a look, and I realized I couldn't just give him access to the server. I needed a way to show him the logs. So, at this point, we added Promtail, Loki, and Grafana to be able to view the logs. You can see how the complexity kept growing

This setup worked for a few days until we realized the frontend needed SSL certificates. "No problem," I thought, and added a Certbot Docker container. This served us really well until the certificates expired 90 days later. I needed to regenerate them and restart Nginx, so it would pick up the new certificates. At this point, I realized the pain of doing this manually, but I didn't do anything about it since it was already done by the time I acknowledged the pain. Fast forward another 90 days, and the certs expired again. Well, enough was enough. I removed the Certbot service from Docker Compose and just ran it as a systemd process. This allowed for auto-renewal of certificates. This still works to this day, two years later, but it had a side effect.

Up to this point, we were using Git to track all infrastructure changes, but I had sneaked in a systemd process that we couldn't track. Now we had to remember it,For someone as forgetful as me, that was a problem waiting to happen.

Let's circle back to the point where we decided to make our infrastructure repository public. Until this point, we were storing all secrets in the Docker Compose.yaml file. But since we take security seriously, I decided to rethink how we could do this correctly without exposing secrets to the public internet. At work, my employer uses HashiCorp Vault to store secrets, so it was an obvious choice to do the same. I created DigitalOcean VMs to experiment with this. From the start, it was clear I'd need two instances: one for development and one for production. Once this was done, we were able to open-source the infrastructure deployment code.

This worked for 18 months, but as you can see, nothing in the architecture is truly reproducible.

I think it is time we revisit and this time I will actually think hard of how all these components fit together. 
