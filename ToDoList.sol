// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract TodoList {
    struct Todo {
        string text;
        bool completed;
    }

    Todo[] public todos;

    function create(string calldata _text) external {
        todos.push(Todo({
            text: _text,
            completed: false
        }));
    }

    function updateText(uint _index, string calldata _text) external {
        //for one field to update cheaper
        todos[_index].text = _text;
        //or
        //for more fields to be updated cheaper
        Todo storage todo = todos[_index];
        todo.text = _text;
    }

    function updateText(uint _index) external {
        todos[_index].completed = !todos[_index].completed;
    }

    function get(uint _index) external view returns (string memory, bool) {
        Todo memory todo = todos[_index];
        return (todo.text, todo.completed);
    }
}