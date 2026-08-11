# isolde

A unified media app for movies, TV shows, anime, manga, comics, and books — bring your own sources, connect trackers, organize your library, and keep everything together in one place.

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/2338858eca4c4265a0e1897ca7da5d63)](https://app.codacy.com/gh/lacrimanstinea/isolde/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![CI](https://github.com/lacrimanstinea/isolde/actions/workflows/build.yml/badge.svg)](https://github.com/lacrimanstinea/isolde/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/lacrimanstinea/isolde?style=flat-square)](https://github.com/lacrimanstinea/isolde/releases)
[![License](https://img.shields.io/github/license/lacrimanstinea/isolde?style=flat-square)](https://github.com/lacrimanstinea/isolde/blob/main/LICENSE)

## Table of contents

- [What is isolde?](#what-is-isolde)
- [Key features](#key-features)
- [Stuff used](#stuff-used)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick start (development)](#quick-start-development)
- [Project structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)

## What is isolde?

isolde is a cross-platform media hub designed to consolidate many media types and services into a single, privacy-minded app. the goal is to reduce context switching between multiple sites/apps by letting you bring your own sources and trackers, manage a single organized library, and sync across devices.

## Key features

(all of these are basically what i plan to make anyway)

- OFFLINE FIRST, YOU OWN YOUR DATA
- Unified view for movies, TV shows, anime, manga, comics, and books
- Bring-your-own-sources: add scrapers, feeds, or connectors to your preferred providers
- Tracker integrations: connect existing tracker accounts (Anilist, MyAnimeLis)
- Local library organization + optional sync / cloud backends
- Cross-platform UI (web & native clients)
- And well u get the jist

## Stuff used

This repository mixes frontend, mobile, and backend/native components:

- svelte - for the ui mobile/desktop
- tailwind - for styling
- tauri - desktop and android (ik webview sucks but tauri at least bundles smaller apps)
- typescript - i cant work without typings
- Rust - for tauri

## Getting started

### Prerequisites

- Bun
- Rust (for tauri)
- Android Studio (for the Android app) and a compatible JDK (17+)

### Quick start (development)

1. initial setup
   - bun install
     the default port is 5173, don't really change it because it's how half the app works i think idk
2. desktop (tauri)
   - bun dev:tauri:desktop
3. android (tauri)
   - cd core/tauri
   - bunx tauri android init
   - cd ../../
   - dev:tauri:android
4. all (what i do cuz im lazy)
   - cd core/tauri
   - bunx tauri android init (if you haven't already)
   - cd ../../
   - bun dev:all
     (this spins up web, android and desktop stuff)

to be honest i don't have an ios or macos device to test so i'm just hoping all of this works out of the box but i don't officially provide support since i literally can't test it nor do i care too much tbh

## Project structure

- core/app - svelte frontend
- core/tauri - tauri for desktop and mobile

## Configuration

handled by the github actions im too lazy to go into it, just read the code

## Contributing

We welcome contributions! Suggested workflow:

1. Fork the repository and create a branch: feature/your-feature or fix/issue-123
2. Keep changes focused and add tests where applicable
3. Open a pull request describing the change and linking any relevant issues
4. Follow the commit message
