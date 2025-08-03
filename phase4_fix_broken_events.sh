#!/bin/bash

echo "Fixing broken event handlers..."

# Fix the double React.ChangeEvent pattern
find glory-ui/src -name "*.tsx" -type f -exec sed -i 's/onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) React.ChangeEvent<HTMLInputElement>)/onChange={(e: React.ChangeEvent<HTMLInputElement>)/g' {} \;

# Fix textareas that should remain textareas  
find glory-ui/src -name "*.tsx" -type f -exec sed -i 's/onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('\''notes'\''/onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('\''notes'\''/g' {} \;

echo "Event handler fixes complete!"