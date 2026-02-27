#!/usr/bin/env python3
"""
Backend API Test Script
Tests all API endpoints to verify they're working correctly
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8001/api"

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def test_endpoint(name, endpoint, method="GET", data=None):
    """Test a single API endpoint"""
    print(f"\nTesting: {name}")
    print(f"Endpoint: {endpoint}")
    
    try:
        url = f"{BASE_URL}{endpoint}"
        
        if method == "GET":
            response = requests.get(url, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=5)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("SUCCESS")
            data = response.json()
            print(f"Response Preview: {json.dumps(data, indent=2)[:500]}...")
            return True
        else:
            print(f"FAILED: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to backend. Is it running?")
        return False
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

def main():
    print_header("Backend API Test Suite")
    print(f"Testing backend at: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Test 1: Dashboard Overview
    print_header("Test 1: Dashboard Overview")
    results.append(test_endpoint(
        "Dashboard Overview",
        "/dashboard/overview"
    ))
    
    # Test 2: Campaigns
    print_header("Test 2: Campaigns")
    results.append(test_endpoint(
        "Campaigns List",
        "/campaigns"
    ))
    
    # Test 3: A/B Tests
    print_header("Test 3: A/B Tests")
    results.append(test_endpoint(
        "A/B Tests List",
        "/ab-tests"
    ))
    
    # Test 4: ML Models
    print_header("Test 4: ML Models")
    results.append(test_endpoint(
        "ML Models Status",
        "/models"
    ))
    
    # Test 5: User Recommendations
    print_header("Test 5: User Recommendations")
    results.append(test_endpoint(
        "User Recommendations",
        "/recommendations/1"
    ))
    
    # Test 6: CTR Prediction
    print_header("Test 6: CTR Prediction")
    test_ad_data = {
        "user_id": 1,
        "ad_id": 1,
        "category": "tech",
        "hour": 14,
        "day_of_week": 3
    }
    results.append(test_endpoint(
        "CTR Prediction",
        "/predict/ctr",
        method="POST",
        data=test_ad_data
    ))
    
    # Summary
    print_header("Test Summary")
    passed = sum(results)
    total = len(results)
    print(f"\nTests Passed: {passed}/{total}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("\nAll tests passed! Your backend is working correctly.")
    elif passed > 0:
        print(f"\nPartial success: {total - passed} test(s) failed.")
        print("Check the output above for details.")
    else:
        print("\nAll tests failed. Make sure your backend is running:")
        print("  cd backend")
        print("  python main.py")

if __name__ == "__main__":
    main()