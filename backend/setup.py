#!/usr/bin/env python3
"""
Setup script for Glory Boxing Manager FastAPI Backend
Automates the installation and configuration process
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    print("🔍 Checking Python version...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python 3.8+ required, found {version.major}.{version.minor}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def create_virtual_environment():
    """Create a virtual environment"""
    if os.path.exists("venv"):
        print("✅ Virtual environment already exists")
        return True
    
    return run_command("python -m venv venv", "Creating virtual environment")

def activate_virtual_environment():
    """Activate virtual environment"""
    if os.name == 'nt':  # Windows
        activate_script = "venv\\Scripts\\activate"
    else:  # Unix/Linux/Mac
        activate_script = "venv/bin/activate"
    
    if os.path.exists(activate_script):
        print("✅ Virtual environment ready")
        return True
    else:
        print("❌ Virtual environment not found")
        return False

def install_dependencies():
    """Install Python dependencies"""
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip"
    else:  # Unix/Linux/Mac
        pip_cmd = "venv/bin/pip"
    
    return run_command(f"{pip_cmd} install -r requirements.txt", "Installing dependencies")

def setup_environment():
    """Set up environment variables"""
    env_file = Path(".env")
    env_example = Path("env.example")
    
    if env_file.exists():
        print("✅ Environment file already exists")
        return True
    
    if not env_example.exists():
        print("❌ env.example file not found")
        return False
    
    try:
        shutil.copy(env_example, env_file)
        print("✅ Environment file created from template")
        print("⚠️  Please edit .env file with your actual values")
        return True
    except Exception as e:
        print(f"❌ Failed to create environment file: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Glory Boxing Manager FastAPI Backend Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create virtual environment
    if not create_virtual_environment():
        sys.exit(1)
    
    # Activate virtual environment
    if not activate_virtual_environment():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✅ Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Edit the .env file with your Supabase credentials")
    print("2. Run: python run.py")
    print("3. Visit http://localhost:8000/docs")
    print("4. Run: python test_api.py to verify setup")
    
    print("\n🔧 Environment variables to configure:")
    print("- NEXT_PUBLIC_SUPABASE_URL")
    print("- NEXT_PUBLIC_SUPABASE_ANON_KEY")
    print("- SUPABASE_SERVICE_ROLE_KEY")
    print("- SECRET_KEY")

if __name__ == "__main__":
    main() 