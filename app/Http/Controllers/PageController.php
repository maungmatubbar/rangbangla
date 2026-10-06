<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('about');
    }

    public function privacy(): Response
    {
        return Inertia::render('privacy', [
            'lastUpdated' => '2 October 2026',
        ]);
    }
}
