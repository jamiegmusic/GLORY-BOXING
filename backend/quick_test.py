#!/usr/bin/env python3
"""
Quick test to check if server is running
"""

import requests
import time

def test_server():
    print("Testing server...")
    try:
        response = requests.get("http://localhost:8000/")
        print(f"✅ Server is running! Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Server not running: {e}")
        return False

if __name__ == "__main__":
    test_server() 