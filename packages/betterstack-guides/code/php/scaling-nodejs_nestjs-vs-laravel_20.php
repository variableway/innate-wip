# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: php
# Normalized: php
# Block index: 20

// Job class - just implement ShouldQueue
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;
    
    public $tries = 3;
    public $backoff = [30, 60, 120]; // Retry delays in seconds

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function handle()
    {
        Mail::to($this->user->email)->send(new WelcomeMail($this->user));
        
        Log::info("Welcome email sent to {$this->user->email}");
    }

    public function failed(Throwable $exception)
    {
        Log::error("Welcome email failed for user {$this->user->id}: {$exception->getMessage()}");
        
        // Notify administrators or take corrective action
        Notification::send(
            User::administrators(), 
            new JobFailedNotification($this->user, $exception)
        );
    }
}

// Usage in controllers - dispatch and forget
class UserController extends Controller
{
    public function store(CreateUserRequest $request)
    {
        $user = User::create($request->validated());
        
        // Queue the welcome email
        SendWelcomeEmail::dispatch($user);
        
        return new UserResource($user);
    }
}

// Delayed jobs and chains
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));

// Job chains - run jobs in sequence
Bus::chain([
    new SendWelcomeEmail($user),
    new AddToNewsletterList($user),
    new NotifyAdministrators($user),
])->dispatch();