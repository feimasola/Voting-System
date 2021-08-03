<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersAdmin extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::where('id',1)->delete();//To avoid duplicate user accounts
        $user = new User();
        $user->id = 1;
        $user->name = env('USER_NAME','Admin');
        $user->email = env('USER_EMAIL','admin1@admin.com');
        $user->password = bcrypt(env('USER_PASS','admin'));
        $user->save();
    }
}
