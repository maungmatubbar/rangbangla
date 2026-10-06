<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class IssueApiToken extends Command
{
    /**
     * @var string
     */
    protected $signature = 'api:token {email : The user\'s email address} {--name=agent : A label for the token}';

    /**
     * @var string
     */
    protected $description = 'Issue a Sanctum API token for the given user';

    public function handle(): int
    {
        $email = (string) $this->argument('email');
        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email [{$email}].");

            return self::FAILURE;
        }

        $name = (string) $this->option('name');
        $token = $user->createToken($name)->plainTextToken;

        $this->info("API token for {$user->email} (device: {$name}):");
        $this->line($token);

        return self::SUCCESS;
    }
}
