---
title: "Pocket Outside: an open model that helps you close the screen"
published: false
tags: devchallenge, hf26challenge
---

<!-- DRAFT. DO NOT PUBLISH until public demo and code links are filled in and the browser run has been verified. Do not claim an outdoor field trial unless one actually happens. -->

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).*

## What I Built

Sometimes “go outside” is too big an instruction. Choosing a destination, searching for a route and comparing options can turn a break into another screen session.

Pocket Outside starts smaller: “What would feel good?” You write a thought, choose five to twenty minutes, and say whether you want to move or stay in one spot. An open model matches that thought to a short outdoor mission. Listen for three sounds. Visit one plant. Notice how a cloud changes.

The important button is **I'm heading out**. The activity has three short steps and can be saved as a plain-text pocket note. There is no streak to maintain and no route to finish. When you come back, you can save one detail you noticed. The app records that check-in; it cannot prove you went outside.

## Demo

**Public demo or video: [INSERT VERIFIED PUBLIC URL]**

The intended demonstration is: ask for a quiet moment, choose a five-minute stationary activity, take the sound-map card, then return and write one detail. A second pass shows that selecting unsafe conditions yields no outdoor recommendation.

This is a local prototype. In Chrome, I verified the real model, generated cards, downloaded note, return-note persistence and deletion, unsafe-condition stop, repeated use and a 390-pixel layout. Video recording, public hosting and a real outdoor trial are still pending.

## Code

**Public repository: [INSERT VERIFIED PUBLIC REPOSITORY URL]**

The application is MIT licensed. The repository includes setup instructions, a model manifest with hashes, tests, and the model evaluation results. The application and repository were started during this challenge window, on October 11, 2026. Codex assisted with implementation and testing.

## How I Built It

The AI is deliberately narrow. Transformers.js runs the open-weight MiniLM sentence-embedding model. It turns both the user's sentence and each authored activity description into normalized vectors. Similarity tells the app which eligible card is closest in meaning.

Eligibility comes first. A ten-minute walk cannot win a five-minute, stay-in-one-spot request, however similar its description sounds. A sheltered-only request can only receive a sheltered activity. If going outside is unsafe, the app stops before loading the model.

That split matters. The model chooses relevance; small deterministic functions enforce the limits. The activity instructions are written and inspectable rather than generated. The app has no knowledge of the user's weather, route or access needs and makes that visible.

I tested the logic and the interaction flow separately from inference. The real local model selected the expected activity in six authored smoke cases, including listening, gardening, movement and cloud watching. That is a useful check of the core mechanism, not a claim of universal accuracy. The README reports those smoke examples separately from the completed local-browser workflow checks. The browser check also caught a configuration difference from Node: local model loading needed to be explicitly enabled.

## Why Does Open Innovation Matter?

For a short break, creating an account or sending a private feeling to an inference service would be a large price of entry. The open model lets the matching happen locally, with no API key or per-request model charge. Setup still needs an initial public download, and the local server must remain available.

The model is not locked to these ten cards. Someone can inspect the descriptions, replace an activity that does not fit their surroundings, rerun the tests, or try a different embedding model. The manifest pins the version so that a model change is an explicit experiment.

I do not need the AI to invent a spectacular adventure. I need it to understand “my head is full” well enough to offer a small starting point, then get out of the way.

## Prize Categories

Overall prize only. No partner category is claimed.
