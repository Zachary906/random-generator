# Pokémon Wheel Spinner v6.0 - 2025 Architecture

## 🎯 Overview

This document describes the modern architecture of the Pokémon Wheel Spinner after the 2025 quality upgrade.

## 📋 Table of Contents

1. [Architecture Changes](#architecture-changes)
2. [Core Systems](#core-systems)
3. [Performance](#performance)
4. [Error Handling](#error-handling)
5. [Data Management](#data-management)
6. [API Integration](#api-integration)
7. [Development Guide](#development-guide)

---

## Architecture Changes

### Pre-2025 (Legacy)
- Callback-based event handling
- Inline styles and magic strings
- Manual cache management
- Limited error handling
- No performance monitoring

### Post-2025 (Modern)
- ✅ Class-based architecture with ES6+ patterns
- ✅ CSS Custom Properties (variables)
- ✅ Semantic HTML5 with ARIA labels
- ✅ Automatic error recovery
- ✅ Built-in performance monitoring
- ✅ Request deduplication
- ✅ Type hints via JSDoc
- ✅ Comprehensive logging system

---

## Core Systems

### 1. Logger System

**File:** `script.js` (Lines 110-175)

```javascript
class Logger {
    log(...args)      // Standard logging
    error(...args)    // Error logging
    warn(...args)     // Warning logging
    getMessages()     // Retrieve all messages
    clear()           // Clear message buffer
}

const logger = new Logger();
```

**Features:**
- Automatic message formatting
- Safe object stringification
- Max 200 messages buffer
- Type-aware formatting (HTML elements, NodeLists, etc.)

**Usage:**
```javascript
logger.log('Starting operation...');
logger.error('Something went wrong');
logger.warn('This might be a problem');
```

---

### 2. Console Overlay

**File:** `script.js` (Lines 208-290)

```javascript
class ConsoleOverlay {
    toggle()    // Show/hide overlay
    update()    // Update message display
    init()      // Initialize DOM element
}

const consoleOverlay = new ConsoleOverlay();
```

**Features:**
- Press 'C' to toggle console
- Color-coded messages (error/warn/log)
- Clear button for quick reset
- Fixed 500x400px viewport

**Accessibility:**
- ARIA labels for screen readers
- Keyboard navigation support
- Semantic markup

---

### 3. API Client with Caching

**File:** `script.js` (Lines 299-433)

```javascript
class APIClient {
    fetch(endpoint, options)  // Smart fetch with caching
    getStats()               // Cache statistics
    clear()                  // Clear cache
}

const apiClient = new APIClient();
```

**Features:**
- **Request Deduplication**: Same request only made once
- **Automatic Caching**: 1-hour TTL (configurable)
- **Retry Logic**: Up to 3 automatic retries
- **Timeout Handling**: 10-second timeout per request
- **Cache Pruning**: Maintains max 100 cached items
- **Performance Tracking**: Metrics on cache hits/misses

**Configuration:**
```javascript
CONFIG = {
    CACHE_DURATION: 3600000,   // 1 hour
    MAX_CACHE_SIZE: 100,
    REQUEST_TIMEOUT: 10000,    // 10 seconds
}
```

**Usage:**
```javascript
// Uses cache by default
const data = await apiClient.fetch('/pokemon?limit=100');

// Stats tracking
const stats = apiClient.getStats();
console.log(`Cache hit rate: ${stats.hitRate * 100}%`);

// Clear if needed
apiClient.clear();
```

---

### 4. Error Boundary & Recovery

**File:** `script.js` (Lines 435-512)

```javascript
class ErrorBoundary {
    captureError(errorData)  // Capture with recovery attempt
    getErrors()             // Retrieve error history
    clear()                 // Clear error log
}

const errorBoundary = new ErrorBoundary();
```

**Features:**
- Global error handler
- Unhandled promise rejection handler
- Automatic recovery attempts
- Error history (max 20)
- Integration with METRICS

**Recovery Strategies:**
- Network errors → Clear cache
- Timeout → Retry with backoff
- Invalid data → Fallback handling

**Usage:**
```javascript
// Automatic - no code needed
// Errors are captured globally

// Access error history
const errors = errorBoundary.getErrors();
console.log(`Total errors: ${errors.length}`);
```

---

### 5. Performance Monitor

**File:** `script.js` (Lines 514-625)

```javascript
class PerformanceMonitor {
    mark(name, data)        // Record checkpoint
    measure(start, end)     // Calculate duration
    getReport()            // Full performance report
    showDashboard()        // Display UI dashboard
}

const performanceMonitor = new PerformanceMonitor();
```

**Metrics Tracked:**
- Page load time
- API call count
- Cache statistics
- Memory usage
- Error frequency
- Uptime

**Dashboard Report:**
```json
{
    "version": "6.0.0",
    "uptime": 45678,
    "api": {
        "totalCalls": 23,
        "cacheHits": 18,
        "cacheHitRate": 0.78,
        "avgResponseTime": 245
    },
    "memory": {
        "usedJSHeapSize": 12,
        "totalJSHeapSize": 45,
        "jsHeapSizeLimit": 2048
    }
}
```

**Usage:**
```javascript
// Mark operations
performanceMonitor.mark('search-start');
// ... do work ...
performanceMonitor.mark('search-end');

// Measure duration
const duration = performanceMonitor.measure('search', 'search-start', 'search-end');

// Show dashboard (hotkey: Press 'S' or use showStats())
window.showStats();
```

---

## Data Management

### Local Storage Architecture

**Keys per user:**
- `pokemonChecklist_{user}` - Main checklist data
- `pokemonStats_{user}` - Statistics tracking
- `pokemonChecklistBackup_{user}_{timestamp}` - Auto-backups
- `pokemonChangeHistory_{user}` - Undo/redo history

**Data Versioning:**
```javascript
DATA_VERSION = 2  // Enables backward compatibility
```

**Validation:**
- On load, data is validated
- Corrupted data triggers auto-restore from backup
- Failed validation falls back to empty state

---

## API Integration

### Modern Patterns Used

**1. Promise-based with async/await:**
```javascript
async function searchPokemon(query) {
    try {
        const data = await apiClient.fetch(`/pokemon/${query}`);
        return processData(data);
    } catch (error) {
        errorBoundary.captureError(error);
        throw error;
    }
}
```

**2. Request Deduplication:**
```javascript
// Both calls share the same request
const p1 = apiClient.fetch('/pokemon?limit=100');
const p2 = apiClient.fetch('/pokemon?limit=100');  // Uses pending request from p1
```

**3. Caching with TTL:**
```javascript
// First call: fetches from API
const data1 = await apiClient.fetch('/types');

// Within 1 hour: uses cache
const data2 = await apiClient.fetch('/types');  // Cache hit

// After 1 hour: fetches fresh
const data3 = await apiClient.fetch('/types');  // Cache miss
```

---

## Performance Optimizations

### 1. **Lazy Loading**
- Wheel data loaded on demand
- Search results paginated
- Images lazy-loaded with intersection observer

### 2. **Request Batching**
- Multiple Pokemon fetches in parallel
- Promise.all() for concurrent requests
- Reduced total request time

### 3. **Caching Strategy**
- PokéAPI responses cached for 1 hour
- User checklist cached locally
- Browser storage limits respected

### 4. **Memory Management**
- Cache pruned to max 100 items
- Message buffers limited to recent 200
- Error history limited to 20 errors
- DOM cleanup on screen transitions

---

## CSS Modern Features

### CSS Variables (Design Tokens)

```css
:root {
    /* Colors */
    --color-primary: #667eea;
    --color-accent: #f5576c;
    
    /* Spacing */
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    
    /* Transitions */
    --transition-base: 300ms ease-in-out;
}
```

**Benefits:**
- Easy theme switching
- Consistent design system
- Single point of change
- Better readability

### Modern CSS Layouts

```css
/* Grid for responsive layouts */
.wheel-options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
}

/* Flexbox for alignment */
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Backdrop blur for modern glass effect */
.app-header {
    backdrop-filter: blur(10px);
}
```

---

## Accessibility Features

### Semantic HTML5
```html
<header role="banner">
<main role="main">
<nav role="navigation">
<section role="region">
<article>
<footer role="contentinfo">
```

### ARIA Labels
```html
<button aria-label="Toggle console (Press C)">🖥️ Console</button>
<input aria-label="Search Pokémon by name or number">
<div role="region" aria-label="Search results" aria-live="polite"></div>
```

### Screen Reader Support
- `.sr-only` class for screen-reader-only content
- Meaningful button labels
- Form label associations
- Region landmarks

---

## Development Guide

### Adding a New Feature

1. **Create a Class** (if needed)
```javascript
class MyFeature {
    constructor() {
        dbg('Initializing MyFeature');
    }
    
    doSomething() {
        performanceMonitor.mark('feature-start');
        // ... code ...
        performanceMonitor.mark('feature-end');
    }
}
```

2. **Handle Errors**
```javascript
try {
    // code
} catch (error) {
    errorBoundary.captureError({
        type: 'my-feature',
        message: error.message,
        stack: error.stack,
    });
}
```

3. **Log Progress**
```javascript
dbg('📂 Loading data...');
dbg('✅ Data loaded');
dbg('❌ Error occurred');
```

4. **Track Performance**
```javascript
performanceMonitor.mark('operation-start');
await longOperation();
performanceMonitor.mark('operation-end');
const duration = performanceMonitor.measure('op', 'operation-start', 'operation-end');
dbg(`Operation took ${duration.toFixed(2)}ms`);
```

---

### Configuration

All settings in one place:

```javascript
const CONFIG = Object.freeze({
    VERSION: '6.0.0',
    DEBUG: true,
    API_BASE: 'https://pokeapi.co/api/v2',
    CACHE_DURATION: 3600000,    // 1 hour
    MAX_CACHE_SIZE: 100,
    CONSOLE_MAX_MESSAGES: 200,
    REQUEST_TIMEOUT: 10000,
    PERFORMANCE_TRACKING: true,
});
```

---

### Global API

Available globally for console testing:

```javascript
window.showConsoleOverlay()      // Show/hide console
window.showStats()               // Show performance dashboard
window.initApp()                 // Reinitialize app
window.apiClient                 // Direct API client access
window.performanceMonitor        // Direct monitor access
window.errorBoundary             // Direct error boundary access
```

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (with polyfills - not recommended)

---

## Performance Benchmarks

**Target Metrics:**
- Page load: < 2 seconds
- First search: < 1 second (with network)
- Subsequent searches: < 100ms (cached)
- Memory usage: < 50MB
- Cache hit rate: > 70%

---

## Troubleshooting

### High Memory Usage
```javascript
// Clear cache
window.apiClient.clear();

// View memory stats
const report = window.performanceMonitor.getReport();
console.log(report.memory);
```

### Slow Performance
```javascript
// Check cache hit rate
const stats = window.apiClient.getStats();
if (stats.cacheHitRate < 0.5) {
    console.warn('Low cache hit rate');
}

// View performance dashboard
window.showStats();
```

### Failed Requests
```javascript
// Check error history
const errors = window.errorBoundary.getErrors();
console.log('Recent errors:', errors.slice(-5));
```

---

## Future Improvements

- [ ] Service Worker for offline support
- [ ] WebWorkers for heavy computations
- [ ] IndexedDB for larger data sets
- [ ] Real-time sync with backend
- [ ] Progressive Web App (PWA) support
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework

---

## License

MIT © 2025 Pokémon Wheel Spinner

---

**Last Updated:** November 2025  
**Version:** 6.0.0  
**Status:** Production Ready ✅
