<?php

namespace App\Http\Controllers\API\v1\Voter;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Util;
use App\Voter;

class GetController extends Controller
{
    public function __invoke()
    {
        return Voter::where('election_id', Util::getCurrentElection())->orderBy('name', 'asc')->paginate(30);
    }
    public function searchData($data){
        $data = Voter::where('election_id', Util::getCurrentElection())->where('name', 'LIKE', '%' .$data. '%')->get();

        return $data;
    }
}
