#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests the optimizations implemented on the Polish & Bloom website
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function testPerformance() {
    console.log('🚀 Starting Performance Tests...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Test pages
    const pages = [
        { url: 'http://localhost:3000', name: 'Homepage' },
        { url: 'http://localhost:3000/about.html', name: 'About' },
        { url: 'http://localhost:3000/rainbow-cashflow.html', name: 'Rainbow Cashflow' },
        { url: 'http://localhost:3000/apply.html', name: 'Apply' }
    ];
    
    const results = [];
    
    for (const testPage of pages) {
        console.log(`📊 Testing ${testPage.name}...`);
        
        // Navigate to page
        await page.goto(testPage.url, { waitUntil: 'networkidle2' });
        
        // Get performance metrics
        const metrics = await page.evaluate(() => {
            return {
                // Core Web Vitals
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
                
                // Resource counts
                resourceCount: performance.getEntriesByType('resource').length,
                
                // JavaScript execution time
                scriptTime: performance.getEntriesByType('measure').reduce((total, measure) => {
                    return total + measure.duration;
                }, 0),
                
                // Check if optimizations are working
                hasPreconnect: document.querySelector('link[rel="preconnect"]') !== null,
                hasCriticalCSS: document.querySelector('style') !== null,
                hasAsyncCSS: document.querySelector('link[rel="preload"][as="style"]') !== null,
                hasDeferredJS: document.querySelector('script[defer]') !== null,
                
                // Check for performance-optimized elements
                hasPerformanceClasses: document.querySelector('[class*="will-change"]') !== null,
                hasGPUAcceleration: getComputedStyle(document.querySelector('.button')).transform !== 'none'
            };
        });
        
        // Test animation performance
        const animationTest = await page.evaluate(() => {
            const button = document.querySelector('.button');
            if (!button) return { fps: 0, smooth: false };
            
            // Simulate hover and measure frame rate
            let frameCount = 0;
            const startTime = performance.now();
            
            return new Promise((resolve) => {
                const measureFrames = () => {
                    frameCount++;
                    if (performance.now() - startTime < 1000) {
                        requestAnimationFrame(measureFrames);
                    } else {
                        resolve({
                            fps: frameCount,
                            smooth: frameCount >= 55 // Close to 60fps
                        });
                    }
                };
                
                // Trigger animation
                button.dispatchEvent(new Event('mouseenter'));
                requestAnimationFrame(measureFrames);
            });
        });
        
        const result = {
            page: testPage.name,
            url: testPage.url,
            metrics: metrics,
            animation: animationTest,
            grade: calculateGrade(metrics, animationTest)
        };
        
        results.push(result);
        
        // Log results
        console.log(`  ✅ Load Time: ${metrics.loadTime}ms`);
        console.log(`  ✅ DOM Ready: ${metrics.domReady}ms`);
        console.log(`  ✅ First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
        console.log(`  ✅ FCP: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
        console.log(`  ✅ Animation FPS: ${animationTest.fps}`);
        console.log(`  ✅ Optimizations: ${checkOptimizations(metrics)}`);
        console.log(`  📊 Grade: ${result.grade}\n`);
    }
    
    await browser.close();
    
    // Generate report
    generateReport(results);
    
    console.log('🎉 Performance testing complete!');
    console.log('📋 Report saved to: performance-test-results.json');
}

function calculateGrade(metrics, animation) {
    let score = 0;
    
    // Load time scoring (40% weight)
    if (metrics.loadTime < 1000) score += 40;
    else if (metrics.loadTime < 2000) score += 30;
    else if (metrics.loadTime < 3000) score += 20;
    else score += 10;
    
    // FCP scoring (30% weight)
    if (metrics.firstContentfulPaint < 1000) score += 30;
    else if (metrics.firstContentfulPaint < 1500) score += 25;
    else if (metrics.firstContentfulPaint < 2000) score += 20;
    else score += 10;
    
    // Animation performance (20% weight)
    if (animation.fps >= 55) score += 20;
    else if (animation.fps >= 45) score += 15;
    else if (animation.fps >= 30) score += 10;
    else score += 5;
    
    // Optimization implementation (10% weight)
    const optimizationScore = 
        (metrics.hasPreconnect ? 2 : 0) +
        (metrics.hasCriticalCSS ? 2 : 0) +
        (metrics.hasAsyncCSS ? 2 : 0) +
        (metrics.hasDeferredJS ? 2 : 0) +
        (metrics.hasGPUAcceleration ? 2 : 0);
    
    score += optimizationScore;
    
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
}

function checkOptimizations(metrics) {
    const checks = [
        metrics.hasPreconnect && '✅ Preconnect',
        metrics.hasCriticalCSS && '✅ Critical CSS',
        metrics.hasAsyncCSS && '✅ Async CSS',
        metrics.hasDeferredJS && '✅ Deferred JS',
        metrics.hasGPUAcceleration && '✅ GPU Acceleration'
    ].filter(Boolean);
    
    return checks.length > 0 ? checks.join(', ') : '❌ No optimizations detected';
}

function generateReport(results) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalPages: results.length,
            averageLoadTime: results.reduce((sum, r) => sum + r.metrics.loadTime, 0) / results.length,
            averageFCP: results.reduce((sum, r) => sum + r.metrics.firstContentfulPaint, 0) / results.length,
            averageFPS: results.reduce((sum, r) => sum + r.animation.fps, 0) / results.length,
            gradesDistribution: results.reduce((dist, r) => {
                dist[r.grade] = (dist[r.grade] || 0) + 1;
                return dist;
            }, {})
        },
        details: results,
        recommendations: generateRecommendations(results)
    };
    
    fs.writeFileSync('performance-test-results.json', JSON.stringify(report, null, 2));
}

function generateRecommendations(results) {
    const recommendations = [];
    
    results.forEach(result => {
        if (result.metrics.loadTime > 2000) {
            recommendations.push(`${result.page}: Consider further optimizing load time (${result.metrics.loadTime}ms)`);
        }
        
        if (result.metrics.firstContentfulPaint > 1500) {
            recommendations.push(`${result.page}: Optimize First Contentful Paint (${result.metrics.firstContentfulPaint.toFixed(2)}ms)`);
        }
        
        if (result.animation.fps < 45) {
            recommendations.push(`${result.page}: Improve animation performance (${result.animation.fps} FPS)`);
        }
        
        if (!result.metrics.hasGPUAcceleration) {
            recommendations.push(`${result.page}: Add GPU acceleration for animations`);
        }
    });
    
    return recommendations.length > 0 ? recommendations : ['All pages are performing well! 🎉'];
}

// Run the tests
testPerformance().catch(console.error); 