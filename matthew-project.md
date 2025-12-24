# 

[Project Proposal](#project-proposal)

[1\. Purpose of This Document](#1.-purpose-of-this-document)

[2\. Overall Project Breakdown (High Level)](#2.-overall-project-breakdown-\(high-level\))

[3\. Assumptions & Constraints (Applies to All Sections)](#3.-assumptions-&-constraints-\(applies-to-all-sections\))

[SECTION A (Shadman)](#section-a-\(shadman\))

[Labor Pool, Dispatch & Communication System](#labor-pool,-dispatch-&-communication-system)

[A1. Problem This Solves](#a1.-problem-this-solves)

[A2. Core Design Principles](#a2.-core-design-principles)

[A3. User Types](#a3.-user-types)

[A4. Labor Pool Management (Admin)](#a4.-labor-pool-management-\(admin\))

[Features](#features)

[Explicitly Included](#explicitly-included)

[Explicitly Excluded (for MVP)](#explicitly-excluded-\(for-mvp\))

[A5. Dispatch Flow (Core Feature)](#a5.-dispatch-flow-\(core-feature\))

[Dispatch Logic](#dispatch-logic)

[MVP Rules](#mvp-rules)

[A5.1 Dispatch Board (Dashboard-Level Feature)](#a5.1-dispatch-board-\(dashboard-level-feature\))

[A6. Communication System](#a6.-communication-system)

[Event-Based Chat](#event-based-chat)

[Chat Capabilities](#chat-capabilities)

[Explicitly Excluded](#explicitly-excluded)

[A7. Mobile App MVP (Labor Only)](#a7.-mobile-app-mvp-\(labor-only\))

[Purpose](#purpose)

[Platform](#platform)

[Features Included](#features-included)

[Features Explicitly Excluded](#features-explicitly-excluded)

[A8. Technical Stack (Proposed)](#a8.-technical-stack-\(proposed\))

[A9. Estimated Effort](#a9.-estimated-effort)

[Scope Notes (Explicit for Contract Safety)](#scope-notes-\(explicit-for-contract-safety\))

[A10. Acceptance Criteria (Critical)](#a10.-acceptance-criteria-\(critical\))

[SECTION B (Philipp)](#section-b-\(philipp\))

[Website, Figma → Next.js, Checkout & Inquiry Flow](#website,-figma-→-next.js,-checkout-&-inquiry-flow)

[B1. Scope Overview](#b1.-scope-overview)

[B2. Figma → Next.js Implementation](#b2.-figma-→-next.js-implementation)

[B3. Checkout / Inquiry Flow](#b3.-checkout-/-inquiry-flow)

[B4. Webflow → Next.js Migration](#b4.-webflow-→-next.js-migration)

[B5. Estimated Hours & Milestones](#b5.-estimated-hours-&-milestones)

[SECTION C](#section-c)

[Coordination & Fixed-Price Structure](#coordination-&-fixed-price-structure)

# 

# **Project Proposal** {#project-proposal}

**Events Platform Rebuild**

**Prepared by:** Shadman Khandaker & Philipp Klemmer

**Client:** Matthew Smith

## **1\. Purpose of This Document** {#1.-purpose-of-this-document}

This document defines the **exact scope, responsibilities, deliverables, and estimated effort** for the next phase of The Expréss.

The goal is to:

* Remove ambiguity

* Align expectations across all par ties

* Enable fixed-price milestones with clear acceptance criteria

* Avoid scope creep and future disputes

This proposal is intentionally detailed and written to be enforceable and reviewable.

## **2\. Overall Project Breakdown (High Level)** {#2.-overall-project-breakdown-(high-level)}

The project is divided into two major workstreams:

1. **Labor Pool, Dispatch & Communication System (including Mobile App MVP)**

    Owner: **Shadman Khandaker**

2. **Marketing Website, Figma → Next.js, Checkout / Inquiry Flow**

    Owner: **Philipp Klemmer**

Both systems will integrate with the existing Supabase backend and Next.js application.

## **3\. Assumptions & Constraints (Applies to All Sections)** {#3.-assumptions-&-constraints-(applies-to-all-sections)}

* Supabase will remain the primary backend (Auth, DB, Realtime, Storage)

* Next.js will be the primary web framework

* Mobile app MVP is **labor-only**, not a full marketplace

* MVP means **functional, production-ready**, not feature-complete

* All features must work reliably on mobile devices

* Anything not explicitly listed is **out of scope**

# **SECTION A (Shadman)** {#section-a-(shadman)}

# **Labor Pool, Dispatch & Communication System** {#labor-pool,-dispatch-&-communication-system}

**Owner: Shadman Khandaker**

## **A1. Problem This Solves** {#a1.-problem-this-solves}

Matthew needs a **reliable, mobile-first labor operations system** to:

* Manage staff across multiple cities

* Dispatch workers based on role \+ location

* Communicate before, during, and after events

* Replace ad-hoc WhatsApp / SMS chaos

* Eliminate manual coordination overhead

This system is **event-centric**, not a public marketplace.

## **A2. Core Design Principles** {#a2.-core-design-principles}

* **Event-centric model**: Everything revolves around an Event

* **Role-based dispatch**: Bartender, Server, Chef, etc.

* **Mobile-first for staff**

* **Admin-controlled system** (not open bidding)

* **Simple, fast, reliable MVP**

## **A3. User Types** {#a3.-user-types}

1. **Admin (Matthew / Ops)**

2. **Staff / Labor Pool Worker**

3. **Client / Vendor (limited visibility)**

## **A4. Labor Pool Management (Admin)** {#a4.-labor-pool-management-(admin)}

### **Features** {#features}

* Create staff profiles manually or via invite

* Assign:

  * Role types (bartender, server, etc.)

  * City / region

* Staff status:

  * Active

  * Inactive

* View staff history per event (MVP-level)

### **Explicitly Included** {#explicitly-included}

* Admin dashboard listing all staff

* Ability to invite staff via email

* Staff self-onboarding form after invite

### **Explicitly Excluded (for MVP)** {#explicitly-excluded-(for-mvp)}

* Ratings system

* Payments to staff

* Public profiles

* Marketplace bidding

## **A5. Dispatch Flow (Core Feature)** {#a5.-dispatch-flow-(core-feature)}

### **Dispatch Logic** {#dispatch-logic}

1. Admin creates or opens an Event

2. Admin selects:

   * Role type(s)

   * City

   * Number of workers needed

3. System sends job request to **matching staff**

4. Staff receive:

   * Mobile push notification

   * In-app notification

5. Staff can **Accept or Decline**

6. First accepted responses are locked in

7. Accepted staff are automatically attached to the Event

### **MVP Rules** {#mvp-rules}

* No bidding

* No counter-offers

* Simple accept / decline

### **A5.1 Dispatch Board (Dashboard-Level Feature)** {#a5.1-dispatch-board-(dashboard-level-feature)}

**Purpose**

A centralized Dispatch Board visible at the end of the dashboard for all user accounts, with role-based visibility and permissions.

**Placement**

* Appears as a dedicated section/tab labeled **“Dispatch Board”**

* Located at the bottom of the dashboard navigation for:

  * Admin

  * Client/Vendor

  * Staff (limited view)

**Role-Based Views**

* **Admin**

  * Full visibility of all events

  * See staffing status per role

  * Trigger dispatch requests

  * View accept/decline state in real time

* **Client / Vendor**

  * Read-only visibility

  * See which roles are filled or pending

  * Participate in event chat

  * No ability to dispatch staff

* **Staff**

  * Personal dispatch feed

  * See assigned or pending jobs

  * Accept or decline requests

  * Access event chat once accepted

**MVP Scope**

* One unified Dispatch Board UI

* Role-aware rendering

* Real-time status updates

* No advanced filtering in MVP

**Out of Scope**

* Drag-and-drop scheduling

* Shift swapping

* External calendar sync

## **A6. Communication System** {#a6.-communication-system}

### **Event-Based Chat** {#event-based-chat}

Each Event includes:

* **One group chat**:

  * Admin

  * Assigned staff

  * Client (optional, controlled)

* **Optional 1:1 chat**:

  * Admin ↔ individual staff

### **Chat Capabilities** {#chat-capabilities}

* Real-time messaging

* Mobile-friendly UI

* Message history retained for 30 days post-event

* Archived after event completion

### **Explicitly Excluded** {#explicitly-excluded}

* Voice calls

* Media-heavy sharing

* Emoji reactions

* Advanced moderation tools

## **A7. Mobile App MVP (Labor Only)** {#a7.-mobile-app-mvp-(labor-only)}

### **Purpose** {#purpose}

A **dedicated labor operations app**, acting like a “walkie-talkie” for events.

### **Platform** {#platform}

* React Native (shared logic with web where possible)

* iOS first (Android optional later)

### **Features Included** {#features-included}

* Login / authentication

* View assigned events

* Accept / decline dispatch requests

* Group chat per event

* Push notifications

* Event details (time, location, role)

### **Features Explicitly Excluded** {#features-explicitly-excluded}

* Client booking

* Event creation

* Payments

* Ratings / reviews

* Public marketplace

## **A8. Technical Stack (Proposed)** {#a8.-technical-stack-(proposed)}

* Supabase:

  * Auth

  * Postgres

  * Realtime

  * Storage

* Next.js (Admin & Client)

* React Native (Staff App)

* Push Notifications (Supabase \+ platform services)

## **A9. Estimated Effort**  {#a9.-estimated-effort}

| Component | Description | Estimated Hours |
| ----- | ----- | ----- |
| **Labor Pool Management System** | Staff onboarding, role assignment, city tagging, availability state, admin controls | **18–22** |
| **Dispatch Logic & Role-Based Requests** | Role \+ city-based job dispatch, accept/decline flow, first-accept lock-in, event attachment | **12–15** |
| **Dispatch Board (Dashboard-Level)** | Shared Dispatch Board visible to all user roles with role-based permissions (Admin full control, Client/Vendor read-only, Staff personal feed) | **8–10** |
| **Event-Centric Communication System** | Event group chat (Admin, Client, Staff), optional 1:1 admin-to-staff messaging, message persistence | **12–15** |
| **Mobile App MVP (Labor-Only)** | Lightweight native mobile app focused on job requests, acceptance, dispatch feed, and event chat (no marketplace features) | **25–30** |
| **Integration, QA & Testing** | End-to-end flow validation across roles, mobile/web sync, edge-case handling | **8–10** |
| **Total Estimated Effort** |  | **83–102 hours** |

### **Scope Notes (Explicit for Contract Safety)** {#scope-notes-(explicit-for-contract-safety)}

* Dispatch Board is **a unified operational view**, not a scheduling or analytics system

* No drag-and-drop scheduling

* No calendar sync

* No staff rating or marketplace discovery in MVP

* Mobile app is **labor operations only**, not a full Upwork-style marketplace

**Final numbers to be confirmed jointly before fixed-price conversion**.

## **A10. Acceptance Criteria (Critical)** {#a10.-acceptance-criteria-(critical)}

* Admin can dispatch staff by role \+ city

* Staff reliably receive mobile notifications

* Accepting a job attaches staff to the event automatically

* Chat works before and during the event

* No role-based invoice or upload restrictions leak into this system

# **SECTION B (Philipp)** {#section-b-(philipp)}

# **Website, Figma → Next.js, Checkout & Inquiry Flow** {#website,-figma-→-next.js,-checkout-&-inquiry-flow}

**Owner: Philipp Klemmer**

**Philipp: Please draft your proposal below.**  
You can edit freely inside this section.

## **B1. Scope Overview** {#b1.-scope-overview}

(Philipp to fill)

## **B2. Figma → Next.js Implementation** {#b2.-figma-→-next.js-implementation}

(Philipp to fill)

## **B3. Checkout / Inquiry Flow** {#b3.-checkout-/-inquiry-flow}

(Philipp to fill)

## **B4. Webflow → Next.js Migration** {#b4.-webflow-→-next.js-migration}

(Philipp to fill)

## **B5. Estimated Hours & Milestones** {#b5.-estimated-hours-&-milestones}

(Philipp to fill)

# 

# 

# **SECTION C** {#section-c}

# **Coordination & Fixed-Price Structure** {#coordination-&-fixed-price-structure}

* Each section will convert into **separate fixed-price milestones**

* Any change requires written approval

* Hourly work applies **only to planning & scoping**

* Development milestones are fixed-price with acceptance criteria

**Section D**

* **Group Booking Checkout for events & Vendor dashboard tools**  
  * Vendor will have invoice capability and communication capability  
  * Functionality of pre-designed checkout page will have ticket capability which will then send the results to the vendor.  
  * Calendar tool for coordinators and venues.  
  * [**https://www.exploretock.com/**](https://www.exploretock.com/) **is a good reference**  
    * [**https://www.exploretock.com/gigis-wine-lounge-san-francisco/checkout/confirm-purchase?tock\_content=available\_time\&tock\_medium=availability\_search\&tock\_source=tock**](https://www.exploretock.com/gigis-wine-lounge-san-francisco/checkout/confirm-purchase?tock_content=available_time&tock_medium=availability_search&tock_source=tock)        




