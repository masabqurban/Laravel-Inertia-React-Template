<?php

test('responses carry security headers', function () {
    $response = $this->get(route('home'));

    $response->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader('X-Frame-Options', 'DENY')
        ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
});

test('the content security policy uses a nonce that the inline script carries', function () {
    $response = $this->get(route('home'));

    $policy = $response->headers->get('Content-Security-Policy');
    expect($policy)->toContain("frame-ancestors 'none'")->toContain("object-src 'none'");

    preg_match("/'nonce-([^']+)'/", (string) $policy, $match);
    expect($match[1] ?? null)->not->toBeEmpty();

    // The inline theme script must carry the same nonce, or browsers block it.
    $response->assertSee('<script nonce="'.$match[1].'">', escape: false);
});

test('each response gets a fresh nonce', function () {
    $first = $this->get(route('home'))->headers->get('Content-Security-Policy');
    $second = $this->get(route('home'))->headers->get('Content-Security-Policy');

    expect($first)->not->toBe($second);
});
