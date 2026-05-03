#!/usr/bin/env node
/**
 * dist-watcher.js
 * Watches for file changes and auto-rebuilds the dist/ folder.
 * Run once: node dist-watcher.js
 */

const fs   = require('fs');
const path = require('path');

// â”€â”€ Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ROOT = __dirname;

const HTML_FILES = [
    'index.html','admin.html','blog.html','checkout.html',
    'my-courses.html','reset-password.html','privacy-policy.html',
    'course-act-course.html','course-cbt-course.html','course-dbt-course.html',
    'course-healing-journey-program.html','course-personality-disorders-course.html',
    'gammal-tech.html','terms.html','course-tri-therapy-bundle.html','refund-policy.html'
];

const WATCH_DIRS  = ['css', 'js', 'images', 'fonts'];
const COPY_DIRS   = ['css', 'js', 'images', 'fonts'];
const DIST        = path.join(ROOT, 'dist');

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function log(msg, type = 'info') {
    const colors = { info: '\x1b[36m', ok: '\x1b[32m', warn: '\x1b[33m', err: '\x1b[31m' };
    const reset  = '\x1b[0m';
    const time   = new Date().toLocaleTimeString('en-GB');
    console.log(`${colors[type]}[${time}] ${msg}${reset}`);
}

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    if (fs.statSync(src).isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(f => copyRecursive(path.join(src, f), path.join(dest, f)));
    } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
    }
}

// â”€â”€ Build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildDist() {
    const start = Date.now();

    // Clean dist
    if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
    fs.mkdirSync(DIST, { recursive: true });

    // Copy HTML files
    let htmlCount = 0;
    HTML_FILES.forEach(file => {
        const src = path.join(ROOT, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(DIST, file));
            htmlCount++;
        }
    });

    // Copy directories
    let dirCount = 0;
    COPY_DIRS.forEach(dir => {
        const src = path.join(ROOT, dir);
        if (fs.existsSync(src)) {
            copyRecursive(src, path.join(DIST, dir));
            dirCount++;
        }
    });

    // Count files + size
    function countFiles(dir) {
        let count = 0, size = 0;
        if (!fs.existsSync(dir)) return { count, size };
        fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                const sub = countFiles(full);
                count += sub.count; size += sub.size;
            } else {
                count++; size += fs.statSync(full).size;
            }
        });
        return { count, size };
    }

    const { count, size } = countFiles(DIST);
    const sizeMB = (size / 1024 / 1024).toFixed(2);
    log(`âœ…  dist rebuilt â€” ${count} files Â· ${sizeMB} MB Â· took ${Date.now() - start}ms`, 'ok');
}

// â”€â”€ Debounce â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let debounceTimer = null;
function scheduleRebuild(changedFile) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        log(`ðŸ”„  Change detected: ${changedFile}`, 'warn');
        buildDist();
    }, 500); // wait 500ms for rapid saves to settle
}

// â”€â”€ Watcher â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function startWatching() {
    // Watch HTML files at root
    HTML_FILES.forEach(file => {
        const fullPath = path.join(ROOT, file);
        if (fs.existsSync(fullPath)) {
            fs.watch(fullPath, () => scheduleRebuild(file));
        }
    });

    // Watch directories recursively
    WATCH_DIRS.forEach(dir => {
        const fullPath = path.join(ROOT, dir);
        if (fs.existsSync(fullPath)) {
            fs.watch(fullPath, { recursive: true }, (event, filename) => {
                if (filename) scheduleRebuild(`${dir}/${filename}`);
            });
        }
    });

    log('ðŸ‘€  Watching for changes... (Press Ctrl+C to stop)', 'info');
    log(`ðŸ“  Output: ${DIST}`, 'info');
    console.log('');
}

// â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
console.log('\x1b[35m');
console.log('  â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—');
console.log('  â•‘   Dr. Marwa â€” Auto Dist Builder      â•‘');
console.log('  â•‘   Watching for file changes...       â•‘');
console.log('  â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
console.log('\x1b[0m');

// Initial build
log('ðŸ”¨  Building initial dist...', 'info');
buildDist();
console.log('');

// Start watching
startWatching();

