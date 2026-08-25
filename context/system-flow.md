# Task

Create a brand new context file:

context/system-flow.md

This document will become the definitive source of truth for every internal system workflow inside VibeLogic Studio.

Do NOT make this document short.

Make it extremely detailed.

Think like a

• Senior Software Architect
• Backend Engineer
• Distributed Systems Engineer
• Product Architect

This document should explain exactly what happens INSIDE the application whenever a user performs an action.

This is NOT a UI document.

This is NOT a user journey document.

This is NOT an API reference.

It documents the internal execution flow of the application.

------------------------------------------------------------

# Project

VibeLogic Studio

Production-ready AI-first EdTech SaaS Platform

------------------------------------------------------------

# Technology Stack

Frontend

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui

Backend

Convex

Authentication

Clerk

Payments

Razorpay

Cache

Upstash Redis

Uploads

UploadThing

Emails

Resend

Analytics

PostHog

Monitoring

Sentry

Calendar

FullCalendar

Meetings

Google Meet

Recordings

YouTube (Unlisted)

------------------------------------------------------------

# Document Goal

For every important feature document

Trigger

↓

Validation

↓

Business Logic

↓

Database Operations

↓

Redis Operations

↓

External Services

↓

Realtime Updates

↓

Notifications

↓

Response

↓

Logging

↓

Analytics

↓

Failure Handling

↓

Rollback Strategy (if applicable)

Every system interaction should be documented.

------------------------------------------------------------

# System Architecture

Begin with a high-level architecture diagram.

Example

Browser

↓

Next.js

↓

Clerk Authentication

↓

Convex

↓

Upstash Redis

↓

External Services

Razorpay

UploadThing

Resend

Google Meet

YouTube

PostHog

Sentry

------------------------------------------------------------

# Authentication Flow

Document

User Login

↓

Clerk

↓

JWT

↓

Middleware

↓

Convex Identity

↓

User Lookup

↓

Permission Resolution

↓

Dashboard

Edge Cases

Expired Session

Unauthorized

Missing User

Role Mismatch

------------------------------------------------------------

# Enrollment System Flow

Landing Page

↓

Checkout

↓

Razorpay

↓

Webhook

↓

Payment Verification

↓

Convex Mutation

↓

Create Enrollment

↓

Assign Batch

↓

Update Seats

↓

Cache Invalidation

↓

Send Email

↓

Show Dashboard

Document every database operation.

------------------------------------------------------------

# Batch Assignment Engine

Document

Find Upcoming Batch

↓

Check Capacity

↓

Reserve Seat

↓

Assign Student

↓

Increase Seat Count

↓

Mark Full (if needed)

↓

Invalidate Redis

↓

Realtime Dashboard Update

Edge Cases

No Batch

Batch Full

Cancelled Batch

Concurrent Enrollments

------------------------------------------------------------

# Redis Flow

This project uses Upstash Redis.

Redis is NEVER the source of truth.

Convex remains the only database.

Document Redis usage.

Examples

Landing Page Cache

Marketplace Cache

Course Details Cache

Dashboard Cache

CMS Cache

Rate Limiting

Webhook Idempotency

Temporary Locks

Enrollment Lock

OTP Storage (future)

Temporary Tokens

Document

Cache Keys

TTL Strategy

Invalidation Strategy

Fallback Strategy

Failure Recovery

------------------------------------------------------------

# Convex Flow

Document

Collections

Queries

Mutations

Actions

Realtime

Indexes

Relationships

Validation

Document how every feature interacts with Convex.

------------------------------------------------------------

# Landing Page Flow

Visitor

↓

Redis

↓

Cache Hit

Return

Cache Miss

↓

Convex

↓

Redis Store

↓

Return

Document cache invalidation after CMS updates.

------------------------------------------------------------

# CMS Flow

Admin Saves

↓

Validation

↓

Convex Mutation

↓

Redis Invalidation

↓

Realtime

↓

Landing Page Updated

------------------------------------------------------------

# Marketplace Flow

Visitor

↓

Redis

↓

Course Cache

↓

Convex

↓

Return Courses

↓

Analytics

------------------------------------------------------------

# Dashboard Flow

Student Opens Dashboard

↓

Authentication

↓

Convex Queries

↓

Redis Cache

↓

Announcements

↓

Calendar

↓

Study Materials

↓

Recordings

↓

Realtime

↓

Render

------------------------------------------------------------

# Study Material Flow

Admin Upload

↓

UploadThing

↓

URL

↓

Convex

↓

Realtime

↓

Dashboard

------------------------------------------------------------

# Recording Flow

Admin Adds Recording

↓

YouTube URL

↓

Convex

↓

Redis Invalidation

↓

Dashboard

------------------------------------------------------------

# Calendar Flow

Admin Creates Session

↓

Convex

↓

Redis

↓

Dashboard Calendar

↓

Join Google Meet

------------------------------------------------------------

# Review Flow

Student Submission

↓

Pending

↓

Admin Approval

↓

Convex

↓

Landing Page Cache Invalidation

↓

Marketplace Update

------------------------------------------------------------

# Payment Flow

Checkout

↓

Razorpay

↓

Webhook

↓

Verification

↓

Idempotency Check (Redis)

↓

Convex Mutation

↓

Enrollment

↓

Email

↓

Analytics

↓

Dashboard

Failure Cases

Duplicate Webhook

Payment Failure

Verification Failure

------------------------------------------------------------

# Upload Flow

UploadThing

↓

Validation

↓

Upload

↓

URL

↓

Convex

↓

Realtime

------------------------------------------------------------

# Email Flow

Trigger

↓

Resend

↓

Delivery

↓

Logging

↓

Retry

Examples

Enrollment

Payment

Batch Assignment

Announcements

------------------------------------------------------------

# Analytics Flow

Every important event should be tracked.

Examples

Landing Viewed

CTA Clicked

Course Viewed

Checkout Started

Payment Success

Payment Failure

Dashboard Opened

Recording Viewed

Study Material Downloaded

Review Submitted

Batch Assigned

Document where PostHog events fire.

------------------------------------------------------------

# Monitoring Flow

Document

Sentry

Error Capture

Stack Trace

Performance

Unhandled Exceptions

API Failures

------------------------------------------------------------

# Realtime Flow

Document

Convex Realtime

Subscriptions

Dashboard Refresh

Announcements

CMS Updates

Batch Changes

Student Changes

------------------------------------------------------------

# Background Operations

Document

Cache Refresh

Email Queue

Analytics Sync

Webhook Processing

Retry Strategy

Future Cron Jobs

------------------------------------------------------------

# Security Flow

Document

Authentication

Authorization

Role Validation

Payment Verification

Webhook Signature Validation

Rate Limiting

Redis Locks

CSRF Protection

Secret Management

------------------------------------------------------------

# Error Handling

Document

Validation Errors

Authentication Errors

Payment Errors

Upload Errors

Redis Failures

Convex Failures

Third-party Failures

Retry Strategy

Fallback Strategy

------------------------------------------------------------

# Performance Strategy

Document

Redis Cache

Lazy Loading

Server Components

Image Optimization

Suspense

Streaming

Pagination

Virtualization

Code Splitting

------------------------------------------------------------

# Engineering Principles

Document

Convex is the single source of truth.

Redis is cache only.

Never duplicate business logic.

Never bypass Convex.

Always invalidate cache after mutations.

Always verify payments.

Always use Clerk for identity.

Always use UploadThing for uploads.

Always use Resend for email.

Always track important events.

Always fail gracefully.

------------------------------------------------------------

# Future System Flows

Reserve placeholders for

Certificates

Assignments

Quizzes

AI Tutor

Referral System

Notifications

Mobile App

------------------------------------------------------------

# Formatting

Use Markdown.

Use Mermaid diagrams where appropriate.

Use sequence diagrams.

Use flowcharts.

Use decision trees.

Use tables.

Use numbered execution steps.

Make this document readable by both humans and AI agents.

------------------------------------------------------------

# Final Output

Return a complete production-ready

context/system-flow.md

This document should become the definitive reference for how VibeLogic Studio works internally.

An AI agent should be able to implement every backend workflow, integration, cache strategy, and business process from this document without requiring additional clarification.