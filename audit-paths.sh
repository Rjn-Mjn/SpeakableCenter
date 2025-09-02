#!/bin/bash

# Comprehensive Path Audit Script
# This script performs a deep check of all files to find broken links and paths

echo "🔍 COMPREHENSIVE PATH AUDIT STARTING..."
echo "========================================"
echo ""

BASE_DIR="/run/media/peterlovwood/STORAGE/Speakable"
cd "$BASE_DIR"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Arrays to store issues
declare -a BROKEN_PATHS
declare -a MISSING_FILES
declare -a INCORRECT_IMPORTS

# Counter for issues
ISSUE_COUNT=0

# Function to check if file exists
check_file_exists() {
    local base_path="$1"
    local referenced_file="$2"
    local full_path=""
    
    # Handle different path types
    if [[ "$referenced_file" == /* ]]; then
        # Absolute path from web root
        full_path="$BASE_DIR/client/public$referenced_file"
        if [ ! -f "$full_path" ]; then
            full_path="$BASE_DIR/client/src$referenced_file"
        fi
    elif [[ "$referenced_file" == ../* ]]; then
        # Relative path
        dir=$(dirname "$base_path")
        full_path="$dir/$referenced_file"
        full_path=$(realpath "$full_path" 2>/dev/null)
    else
        # Same directory or subdirectory
        dir=$(dirname "$base_path")
        full_path="$dir/$referenced_file"
    fi
    
    if [ ! -f "$full_path" ] && [ ! -d "$full_path" ]; then
        return 1
    fi
    return 0
}

echo "================================================"
echo "1️⃣  CHECKING HTML FILES"
echo "================================================"
echo ""

# Check HomePage.html
echo "📄 Checking HomePage.html..."
HTML_FILE="$BASE_DIR/client/src/pages/HomePage.html"

if [ -f "$HTML_FILE" ]; then
    # Check CSS links
    echo "   Checking CSS links..."
    grep -o 'href="[^"]*\.css[^"]*"' "$HTML_FILE" | sed 's/href="//;s/"//' | while read css_path; do
        if [[ "$css_path" != http* ]] && [[ "$css_path" != //* ]]; then
            if ! check_file_exists "$HTML_FILE" "$css_path"; then
                echo -e "   ${RED}✗ CSS not found: $css_path${NC}"
                ((ISSUE_COUNT++))
            else
                echo -e "   ${GREEN}✓ CSS found: $css_path${NC}"
            fi
        fi
    done
    
    # Check JavaScript files
    echo "   Checking JavaScript files..."
    grep -o 'src="[^"]*\.js[^"]*"' "$HTML_FILE" | sed 's/src="//;s/"//' | while read js_path; do
        if [[ "$js_path" != http* ]] && [[ "$js_path" != //* ]]; then
            if ! check_file_exists "$HTML_FILE" "$js_path"; then
                echo -e "   ${RED}✗ JS not found: $js_path${NC}"
                ((ISSUE_COUNT++))
            else
                echo -e "   ${GREEN}✓ JS found: $js_path${NC}"
            fi
        fi
    done
    
    # Check image sources
    echo "   Checking images..."
    grep -o 'src="[^"]*\.\(png\|jpg\|jpeg\|gif\|svg\|ico\)[^"]*"' "$HTML_FILE" | sed 's/src="//;s/"//' | while read img_path; do
        if [[ "$img_path" != http* ]] && [[ "$img_path" != //* ]]; then
            if ! check_file_exists "$HTML_FILE" "$img_path"; then
                echo -e "   ${RED}✗ Image not found: $img_path${NC}"
                ((ISSUE_COUNT++))
            else
                echo -e "   ${GREEN}✓ Image found: $img_path${NC}"
            fi
        fi
    done
else
    echo -e "   ${RED}✗ HomePage.html not found!${NC}"
    ((ISSUE_COUNT++))
fi

echo ""
echo "📄 Checking LoginPage.html..."
HTML_FILE="$BASE_DIR/client/src/pages/LoginPage.html"

if [ -f "$HTML_FILE" ]; then
    # Check CSS links
    echo "   Checking CSS links..."
    grep -o 'href="[^"]*\.css[^"]*"' "$HTML_FILE" | sed 's/href="//;s/"//' | while read css_path; do
        if [[ "$css_path" != http* ]] && [[ "$css_path" != //* ]]; then
            if ! check_file_exists "$HTML_FILE" "$css_path"; then
                echo -e "   ${RED}✗ CSS not found: $css_path${NC}"
                ((ISSUE_COUNT++))
            else
                echo -e "   ${GREEN}✓ CSS found: $css_path${NC}"
            fi
        fi
    done
    
    # Check JavaScript files
    echo "   Checking JavaScript files..."
    grep -o 'src="[^"]*\.js[^"]*"' "$HTML_FILE" | sed 's/src="//;s/"//' | while read js_path; do
        if [[ "$js_path" != http* ]] && [[ "$js_path" != //* ]]; then
            if ! check_file_exists "$HTML_FILE" "$js_path"; then
                echo -e "   ${RED}✗ JS not found: $js_path${NC}"
                ((ISSUE_COUNT++))
            else
                echo -e "   ${GREEN}✓ JS found: $js_path${NC}"
            fi
        fi
    done
else
    echo -e "   ${RED}✗ LoginPage.html not found!${NC}"
    ((ISSUE_COUNT++))
fi

echo ""
echo "================================================"
echo "2️⃣  CHECKING CSS FILES"
echo "================================================"
echo ""

# Check all CSS files for broken URLs
find "$BASE_DIR/client/src/styles" -name "*.css" -type f | while read css_file; do
    filename=$(basename "$css_file")
    echo "📄 Checking $filename..."
    
    # Extract URLs from CSS
    grep -o "url(['\"].*['\"])" "$css_file" | sed "s/url(['\"]//;s/['\"])//" | while read url_path; do
        if [[ "$url_path" != http* ]] && [[ "$url_path" != data:* ]]; then
            if ! check_file_exists "$css_file" "$url_path"; then
                echo -e "   ${RED}✗ Resource not found: $url_path${NC}"
                ((ISSUE_COUNT++))
            else
                echo -e "   ${GREEN}✓ Resource found: $url_path${NC}"
            fi
        fi
    done
done

echo ""
echo "================================================"
echo "3️⃣  CHECKING JAVASCRIPT FILES"
echo "================================================"
echo ""

# Check JavaScript imports and API calls
find "$BASE_DIR/client/src/services" -name "*.js" -type f | while read js_file; do
    filename=$(basename "$js_file")
    echo "📄 Checking $filename..."
    
    # Check import statements
    grep -E "^import .* from ['\"]" "$js_file" | sed "s/.*from ['\"]//;s/['\"].*//" | while read import_path; do
        if [[ "$import_path" == ./* ]] || [[ "$import_path" == ../* ]]; then
            if ! check_file_exists "$js_file" "$import_path"; then
                echo -e "   ${RED}✗ Import not found: $import_path${NC}"
                ((ISSUE_COUNT++))
            else
                echo -e "   ${GREEN}✓ Import found: $import_path${NC}"
            fi
        fi
    done
    
    # Check fetch/API calls
    grep -o "fetch(['\"][^'\"]*['\"]" "$js_file" | sed "s/fetch(['\"]//;s/['\"]$//" | while read api_path; do
        echo -e "   ${BLUE}ℹ API endpoint: $api_path${NC}"
    done
done

echo ""
echo "================================================"
echo "4️⃣  CHECKING SERVER CONFIGURATION"
echo "================================================"
echo ""

SERVER_FILE="$BASE_DIR/server/server.js"
if [ -f "$SERVER_FILE" ]; then
    echo "📄 Checking server.js..."
    
    # Check static file paths
    echo "   Checking static file paths..."
    grep -o "express.static([^)]*)" "$SERVER_FILE" | while read static_path; do
        path=$(echo "$static_path" | sed "s/.*['\"]//;s/['\"].*//")
        echo -e "   ${BLUE}ℹ Static path configured: $path${NC}"
    done
    
    # Check sendFile paths
    echo "   Checking sendFile paths..."
    grep -o "sendFile([^)]*)" "$SERVER_FILE" | while read send_path; do
        echo -e "   ${BLUE}ℹ SendFile path: $send_path${NC}"
    done
    
    # Check import paths in server
    echo "   Checking server imports..."
    grep -E "^import .* from ['\"]\./" "$SERVER_FILE" | sed "s/.*from ['\"]//;s/['\"].*//" | while read import_path; do
        full_path="$BASE_DIR/server/$import_path"
        if [ ! -f "$full_path" ] && [ ! -f "${full_path}.js" ]; then
            echo -e "   ${RED}✗ Server import not found: $import_path${NC}"
            ((ISSUE_COUNT++))
        else
            echo -e "   ${GREEN}✓ Server import found: $import_path${NC}"
        fi
    done
else
    echo -e "   ${RED}✗ server.js not found!${NC}"
    ((ISSUE_COUNT++))
fi

echo ""
echo "================================================"
echo "5️⃣  CHECKING FILE CROSS-REFERENCES"
echo "================================================"
echo ""

# Check if referenced assets exist
echo "🔍 Verifying asset files exist..."

# Check fonts
FONT_DIR="$BASE_DIR/client/src/assets/fonts"
if [ -d "$FONT_DIR" ]; then
    font_count=$(find "$FONT_DIR" -type f | wc -l)
    echo -e "   ${GREEN}✓ Found $font_count font files${NC}"
else
    echo -e "   ${RED}✗ Fonts directory not found!${NC}"
    ((ISSUE_COUNT++))
fi

# Check images
IMAGE_DIR="$BASE_DIR/client/src/assets/Images"
if [ -d "$IMAGE_DIR" ]; then
    image_count=$(find "$IMAGE_DIR" -type f | wc -l)
    echo -e "   ${GREEN}✓ Found $image_count image files${NC}"
else
    echo -e "   ${RED}✗ Images directory not found!${NC}"
    ((ISSUE_COUNT++))
fi

# Check if public files exist
echo ""
echo "🔍 Checking public files..."
PUBLIC_DIR="$BASE_DIR/client/public"
if [ -f "$PUBLIC_DIR/favicon.ico" ]; then
    echo -e "   ${GREEN}✓ favicon.ico exists${NC}"
else
    echo -e "   ${RED}✗ favicon.ico not found${NC}"
    ((ISSUE_COUNT++))
fi

if [ -f "$PUBLIC_DIR/.htaccess" ]; then
    echo -e "   ${GREEN}✓ .htaccess exists${NC}"
else
    echo -e "   ${YELLOW}⚠ .htaccess not found (optional)${NC}"
fi

echo ""
echo "================================================"
echo "6️⃣  CHECKING ROUTE CONSISTENCY"
echo "================================================"
echo ""

# Check if server routes match client expectations
echo "🔍 Checking route consistency..."

# Routes defined in server
echo "   Server routes:"
if [ -f "$SERVER_FILE" ]; then
    grep -E "app\.(get|post|put|delete)\(['\"]" "$SERVER_FILE" | sed "s/.*app\.\w*(['\"]//;s/['\"].*//" | while read route; do
        echo -e "   ${BLUE}  - $route${NC}"
    done
fi

# Routes expected by client
echo ""
echo "   Client API calls:"
find "$BASE_DIR/client/src/services" -name "*.js" -type f -exec grep -h "fetch(" {} \; | sed "s/.*fetch(['\"]//;s/['\"].*//" | sort -u | while read api_call; do
    echo -e "   ${BLUE}  - $api_call${NC}"
done

echo ""
echo "================================================"
echo "7️⃣  PATH MAPPING VERIFICATION"
echo "================================================"
echo ""

# Create a mapping of what should exist
echo "📋 Verifying critical path mappings..."

declare -A PATH_MAPPINGS=(
    ["HomePage CSS"]="../styles/Intro/Style.css:client/src/styles/Intro/Style.css"
    ["HomePage JS"]="../services/main.js:client/src/services/main.js"
    ["Login CSS"]="../styles/login.css:client/src/styles/login.css"
    ["Login JS"]="../services/login.js:client/src/services/login.js"
    ["Font Loader"]="../services/font-loader.js:client/src/services/font-loader.js"
    ["Logo Image"]="../assets/Images/Logo.png:client/src/assets/Images/Logo.png"
)

for key in "${!PATH_MAPPINGS[@]}"; do
    IFS=':' read -r relative_path full_path <<< "${PATH_MAPPINGS[$key]}"
    if [ -f "$BASE_DIR/$full_path" ]; then
        echo -e "   ${GREEN}✓ $key: Path mapping correct${NC}"
    else
        echo -e "   ${RED}✗ $key: File missing at $full_path${NC}"
        ((ISSUE_COUNT++))
    fi
done

echo ""
echo "================================================"
echo "📊 AUDIT SUMMARY"
echo "================================================"
echo ""

if [ $ISSUE_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ NO ISSUES FOUND! All paths are correct.${NC}"
else
    echo -e "${RED}❌ FOUND $ISSUE_COUNT ISSUES that need fixing${NC}"
fi

echo ""
echo "📌 Recommendations:"
echo "  1. Fix any red ✗ items above"
echo "  2. Verify yellow ⚠ warnings if needed"
echo "  3. Check blue ℹ items for correctness"
echo "  4. Run this audit again after fixes"

# Save audit results
echo ""
echo "💾 Saving detailed audit report..."
{
    echo "PATH AUDIT REPORT - $(date)"
    echo "================================"
    echo "Issues Found: $ISSUE_COUNT"
    echo ""
    echo "Directories Checked:"
    echo "- client/src/pages/"
    echo "- client/src/styles/"
    echo "- client/src/services/"
    echo "- client/src/assets/"
    echo "- server/"
    echo ""
    echo "Run 'cat audit-report.txt' to see details"
} > audit-report.txt

echo "✅ Audit complete! Report saved to audit-report.txt"
