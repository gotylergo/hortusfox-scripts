#!/bin/sh
# generate-loader.sh
# Generates an index.js payload that dynamically loads all sidecar scripts.

WEB_ROOT="/usr/share/nginx/html"
INDEX_FILE="$WEB_ROOT/index.js"

echo "Generating dynamic script loader..."

# Start the IIFE
cat << 'EOF' > "$INDEX_FILE"
(function() {
    console.log('[HortusFox-Scripts] Initializing dynamic sidecar loader...');
    
    // Attempt to determine where this script was loaded from
    var currentScript = document.currentScript;
    var sidecarUrl = '';
    
    if (currentScript && currentScript.src) {
        var urlObj = new URL(currentScript.src);
        sidecarUrl = urlObj.origin;
    } else {
        console.warn('[HortusFox-Scripts] Could not detect sidecar origin. Defaulting to relative paths.');
    }

    // List of scripts to load
    var scriptsToLoad = [
EOF

# Find all .js files (excluding index.js itself) and add them to the array
find "$WEB_ROOT" -name "*.js" ! -name "index.js" -type f | while read -r file; do
    filename=$(basename "$file")
    echo "        '/$filename'," >> "$INDEX_FILE"
    echo "Found script to load: $filename"
done

# Finish the IIFE
cat << 'EOF' >> "$INDEX_FILE"
    ];

    // Dynamically inject each script into the document head
    scriptsToLoad.forEach(function(scriptPath) {
        var scriptUrl = sidecarUrl + scriptPath;
        console.log('[HortusFox-Scripts] Loading: ' + scriptUrl);
        
        var scriptEl = document.createElement('script');
        scriptEl.src = scriptUrl;
        scriptEl.async = true;
        
        scriptEl.onerror = function() {
            console.error('[HortusFox-Scripts] Failed to load: ' + scriptUrl);
        };
        
        document.head.appendChild(scriptEl);
    });
})();
EOF

echo "Loader generated successfully at $INDEX_FILE"
