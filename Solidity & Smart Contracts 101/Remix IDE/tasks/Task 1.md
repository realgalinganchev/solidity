
### - Play around with the Election

# Try to submit the results for California and observe the logs tab

[
	{
		"from": "0x3328358128832A260C76A4141e19E2A943CD4B6D",
		"topic": "0xa2e71fe38f1afa3762cf9d2ea7bb6a4d272a90fd6f9392f3acedd3b542046b46",
		"event": "LogStateResult",
		"args": {
			"0": 1,
			"1": 32,
			"2": "California",
			"winner": 1,
			"stateSeats": 32,
			"state": "California"
		}
	}
]

# Try to change the account you are interacting from and submit the results for "Nevada". Observe the logs

The transaction has been reverted to the initial state.
Reason provided by the contract: "Not invoked by the owner".

# Try to end the election (do not forget to change back to the first address). Try to submit state result again. Observe the logs.

 -- endElection call: 

[
	{
		"from": "0x3328358128832A260C76A4141e19E2A943CD4B6D",
		"topic": "0xaacb23683ec1a0e9b52f9a6264edf58ad322ac62079d65ea7363a2d400f439f4",
		"event": "LogElectionEnded",
		"args": {
			"0": "1",
			"winner": "1"
		}
	}
]

 -- submitStateResult call again after ending election:

 The transaction has been reverted to the initial state.
Reason provided by the contract: "The election has ended already".