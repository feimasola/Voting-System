<?php

namespace App\Http\Controllers\API\v1\Voter;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Util;
use App\Voter;

class ImportController extends Controller
{
    public function __invoke(Request $request)
    {
    	$this->validateRequest($request);
    	$this->insertVoter($request);
    	return response()->json([
    		'status' => 'success',
    		'message' => 'Voters Imported successfully'
    	]);
    }

    public function insertVoter ($request)
    {
//        dd($request->input('previous'));
//        $voter = $request->all();
        Voter::insert($request->input('messages'));
    }

    private function validateRequest($request)
    {
    	$this->validate($request, [
            'name' => [
                'required',
                Rule::unique('voter')->where(function($query){
                    $query->where('election_id', Util::getCurrentElection());
                })
            ],
            'student_id' => [
                'required',
                Rule::unique('voter')->where(function($query){
                    $query->where('election_id', Util::getCurrentElection());
                })
            ],
    		'course' => 'required'
    	]);
    }
}
