# Task 2: Nudge Feature API Documentation

This document outlines the API structure and data model for the "Nudge Creation" feature based on the provided wireframe requirements.

## 1. Object Data Model (Nudge)

Since we are using MongoDB (schema-less), the document structure for a "Nudge" will be as follows:

```json
{
  "_id": "ObjectId('...')",
  "type": "nudge",
  "uid": "ObjectId (User ID creating the nudge)",
  "event_id": "ObjectId (The event ID this nudge is tagged to)",
  "title": "String (Title of the nudge)",
  "cover_image": "String (URL/path to the uploaded cover image)",
  "schedule": "Timestamp (Date & Time to send the nudge)",
  "description": "String (Detailed description)",
  "icon": "String (URL/path to the uploaded icon)",
  "invitation": "String (One-line invitation text)",
  "created_at": "Timestamp",
  "updated_at": "Timestamp"
}


API Endpoints Specification:

Base URL: /api/v3/app

Api Endpoints Table link:https://docs.google.com/spreadsheets/d/17fOK6yUKOCX2k18cONJeb1VrEXYEzp8H2lMDbYvx12k/edit?gid=812865956#gid=812865956

CRUD Functionalities Description:
Create Nudge (POST):

Accepts multipart/form-data to handle the Cover Image and Icon uploads.

Links the nudge to a specific event_id.

Returns the _id of the created nudge.

Read Nudge (GET):

Retrieves all information including image URLs and schedule time.

Used to display the nudge details on the frontend.

Update Nudge (PUT):

Allows editing the description, title, or changing the schedule time.

Only updates the fields provided in the payload.

Delete Nudge (DELETE):

Removes the nudge document from the collection based on _id.
