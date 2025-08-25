import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Profile Header -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div class="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
              JD
            </div>
            <div class="text-center sm:text-left">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">John Doe</h1>
              <p class="text-gray-600 text-sm sm:text-base">john.doexample.com</p>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">Member since January 2024</p>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Account Settings -->
          <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h2 class="text-lg font-semibold mb-4 text-gray-800">Account Settings</h2>
            <div class="space-y-3">
              <a href="#" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200">
                <span class="text-gray-700">Personal Information</span>
                <span class="text-gray-400 text-lg">→</span>
              </a>
              <a href="#" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200">
                <span class="text-gray-700">Payment Methods</span>
                <span class="text-gray-400 text-lg">→</span>
              </a>
              <a href="#" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200">
                <span class="text-gray-700">Shipping Addresses</span>
                <span class="text-gray-400 text-lg">→</span>
              </a>
              <a href="#" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200">
                <span class="text-gray-700">Notifications</span>
                <span class="text-gray-400 text-lg">→</span>
              </a>
            </div>
          </div>

          <!-- Order History -->
          <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h2 class="text-lg font-semibold mb-4 text-gray-800">Recent Orders</h2>
            <div class="space-y-3">
              <div class="border border-gray-200 rounded-md p-4 hover:border-gray-300 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-medium text-gray-800">Order #12345</span>
                  <span class="text-xs sm:text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">Delivered</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mb-2">2 items • $299.99</p>
                <p class="text-xs text-gray-500">Delivered on Jan 15, 2024</p>
              </div>
              
              <div class="border border-gray-200 rounded-md p-4 hover:border-gray-300 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-medium text-gray-800">Order #12344</span>
                  <span class="text-xs sm:text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Shipped</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mb-2">1 item • $199.99</p>
                <p class="text-xs text-gray-500">Expected delivery: Jan 20, 2024</p>
              </div>
            </div>
            <a routerLink="/orders" class="block text-center text-blue-600 hover:text-blue-700 mt-4 text-sm sm:text-base font-medium">
              View All Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {}