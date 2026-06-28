# Pending Tasks / Incomplete Features

This document tracks the features, bugs, and tasks that are currently pending or not fully implemented in the NovaEdge Digital Labs app.

## 1. Frontend: Real Payment Gateway Integration (Razorpay)
Currently, several screens in the frontend are using **Mock Data** (`pay_mock_...` and `signature_mock`) for Razorpay payments instead of the actual SDK integration. This needs to be replaced with the real `react-native-razorpay` integration to process actual payments.
* **Affected Files:**
  - `frontend/src/screens/CourseDetailScreen.tsx`
  - `frontend/src/screens/PostJobScreen.tsx`
  - `frontend/src/screens/PremiumUpgradeScreen.tsx`



