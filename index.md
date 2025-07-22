# Claude Wrapper Architecture

## Overview
This document describes the architecture and design of the Claude CLI wrapper with automatic chat management.

## Current Implementation

[Current Implementation Diagram](diagrams/current-implementation.md ':include')

## Problem Areas

[Problem Areas](diagrams/problem-areas.md ':include')

## Fixed Architecture

[Fixed Architecture](diagrams/fixed-architecture.md ':include')

## New Approach: Continuous Conversation Mode

[Continuous Mode](diagrams/continuous-mode.md ':include')

[Benefits](diagrams/benefits.md ':include')

[API Design](diagrams/api-design.md ':include')

## Summary

The continuous mode approach offers:
- Keep a Claude process running continuously
- Send messages via stdin/stdout
- Load old chats by replaying them
- No more session ID juggling!

## Navigation

- [Co-Creation Rules](CLAUDE.md)
- [Source Code](claude-wrapper.js)
- [Demo](index.js)
- [Examples](example.js)