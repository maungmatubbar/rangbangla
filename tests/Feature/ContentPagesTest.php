<?php

use Inertia\Testing\AssertableInertia;

it('renders the about page', function () {
    $this->get('/about')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('about'));
});

it('renders the privacy page with a last-updated date', function () {
    $this->get('/privacy')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('privacy')
            ->has('lastUpdated'));
});

it('renders the contact page', function () {
    $this->get('/contact')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('contact'));
});

it('accepts a valid contact submission', function () {
    $this->post('/contact', [
        'name' => 'Ayesha Rahman',
        'email' => 'ayesha@example.com',
        'phone' => '01700000000',
        'subject' => 'Order question',
        'message' => 'I would like to ask about my recent order.',
    ])->assertRedirect()->assertSessionHasNoErrors();
});

it('validates the contact form', function () {
    $this->post('/contact', [
        'name' => '',
        'email' => 'not-an-email',
        'subject' => '',
        'message' => 'short',
    ])->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
});
