// src/lib/booking-storage.ts
'use client'; // localStorage is client-side

import type { BookingRequest } from '@/types';
import { placeholderBookings } from './placeholder-data';

const BOOKINGS_STORAGE_KEY = 'fbsalas_bookings';

// Helper to ensure we don't break on server-side rendering or if localStorage is unavailable
const getLocalStorage = (): Storage | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export const getBookings = (): BookingRequest[] => {
  const storage = getLocalStorage();
  if (!storage) {
    // Return a deep copy of placeholderBookings if localStorage is not available
    return JSON.parse(JSON.stringify(placeholderBookings));
  }

  const storedBookings = storage.getItem(BOOKINGS_STORAGE_KEY);
  if (storedBookings) {
    try {
      return JSON.parse(storedBookings) as BookingRequest[];
    } catch (error) {
      console.error("Error parsing bookings from localStorage:", error);
      // If parsing fails, re-initialize localStorage with placeholders and return a copy
      storage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(placeholderBookings));
      return JSON.parse(JSON.stringify(placeholderBookings));
    }
  }

  // If no bookings in localStorage, initialize with placeholder data and store them
  storage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(placeholderBookings));
  return JSON.parse(JSON.stringify(placeholderBookings));
};

export const addBooking = (newBooking: BookingRequest): void => {
  const storage = getLocalStorage();
  if (!storage) return;

  const currentBookings = getBookings(); // Ensures we get a valid array, possibly from placeholders
  const updatedBookings = [newBooking, ...currentBookings];
  storage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
};

export const updateBooking = (updatedBooking: BookingRequest): void => {
  const storage = getLocalStorage();
  if (!storage) return;

  let currentBookings = getBookings();
  currentBookings = currentBookings.map(b => b.id === updatedBooking.id ? updatedBooking : b);
  storage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(currentBookings));
};

export const deleteBooking = (bookingId: string): void => {
  const storage = getLocalStorage();
  if (!storage) return;
  
  let currentBookings = getBookings();
  currentBookings = currentBookings.filter(b => b.id !== bookingId);
  storage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(currentBookings));
};