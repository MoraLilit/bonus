var listOfUsers = {};

function onLoad(access, bonuses_admin, receiving_bonuses){
    checkUserForAdminRole(access);
    checkAbilityToReceiveBonus(receiving_bonuses);
    checkBonus(bonuses_admin);
}

function checkBonus(bonuses_admin){
    if (parseInt(bonuses_admin) === 0){
        document.getElementById('add-button').disabled = true;
    }
}

// Check if this user is have an ability to give and receive bonuses
function checkAbilityToReceiveBonus(receiving_bonuses){
    if (receiving_bonuses === 'True'){
        document.getElementById('checkbox-for-receiving-bonus').checked = false;
    }
    else{
        document.getElementById('checkbox-for-receiving-bonus').checked = true;
        document.getElementById('add-button').disabled = true;
    }
}

// Get a name of selected user from options
function getOption() {
    selectElement = document.getElementById('select-user-to-sent-bonus');
    output = selectElement.options[selectElement.selectedIndex].text;
    document.querySelector('#output-select-user-to-sent-bonus').textContent = output;
}

// Unable or disable ability to give and receive bonus, json
function forReceivingBonus() {
    if (document.getElementById('checkbox-for-receiving-bonus').checked) {
        if(confirm('If you choose to receive bonuses, you will participate in next round')){
            document.getElementById('add-button').disabled = false;
            document.getElementById('checkbox-for-receiving-bonus').value = 'Off';
            checkBonus(document.getElementById('bonuses-to-give').lastChild.textContent);
            receiveBonus = JSON.stringify({'receiveBonus': true});
            $.ajax({
                url : "/bonus/receive-bonus/",
                type: "POST",
                data:{
                    'receiveBonus': receiveBonus,
                    },
                dataType: 'json',
                // handle a successful response
                success : function(jsondata) {
                    alert(jsondata);
                },
                error : function(jsondata) {
                    alert('Error here in json:' + jsondata);
                }
            });
        }
        else{
            document.getElementById('checkbox-for-receiving-bonus').value = 'On';
        }
    }
    else{
        if(confirm('If you choose not to receive bonuses, you will also not be able to send them to your colleagues')){
            document.getElementById('add-button').disabled = true;
            document.getElementById('bonuses-to-give').lastChild.textContent = 0;
            document.getElementById('checkbox-for-receiving-bonus').value = 'On';
            checkBonus(document.getElementById('bonuses-to-give').lastChild.textContent);
            receiveBonus = JSON.stringify({'receiveBonus': false});

            $.ajax({
                url : "/bonus/receive-bonus/",
                type: "POST",
                data:{
                    'receiveBonus': receiveBonus,
                    },
                dataType: 'json',
                // handle a successful response
                success : function(jsondata) {
                    alert(jsondata);
                },
                error : function(jsondata) {
                    alert('Error here in json:' + jsondata);
                }
            });
        }
        else{
            document.getElementById('checkbox-for-receiving-bonus').value = 'Off';
        }
    }
}

// Create delete button for left table
function deleteButton(){
    var btn = document.createElement("BUTTON");
    btn.setAttribute("id","delete_user");
    btn.setAttribute("type","button");
    btn.setAttribute("textContent","delete");
    btn.setAttribute("class", "save_user u-btn u-btn-round u-button-style u-hover-palette-1-light-1 u-palette-1-base u-radius-50 u-btn-1");
    btn.setAttribute("onmouseup", "deleteUser()")
    return btn
}

// Delete user from left table
function deleteUser(){

}

// Add to left table distributed bonuses data of single user
function addBonusToTable() {
    try{
        username = document.getElementById('select-user-to-sent-bonus').value;
        name = document.getElementById('select-user-to-sent-bonus').options[selectElement.selectedIndex].text;
        quantity = document.getElementById('for-entering-bonuses').value;
        comment = document.getElementById('comment-for-entering-bonuses').value;
        anonymous = document.getElementById('checkbox-for-anonymous').checked;
        current_username = document.getElementById('current-username').textContent;
        if (anonymous){
            anonymous_show = 'Yes'
        }
        else{
            anonymous_show = 'No'
        }
        bonuses_to_give = document.getElementById('bonuses-to-give').lastChild.textContent;
        if (username == 'empty'){
            alert('You forgot to choose the user')
        }
        else if (quantity == '' || parseInt(quantity) <= 0){
            alert('You forgot to enter the quantity or it is incorrect')

        }
        else if (comment == ''){
            alert('You forgot to enter a comment')
        }
        else{
            //Adding a new row to the table containing all sent bonuses rn
            if (parseInt(quantity) <= parseInt(bonuses_to_give)){
                context = [name, quantity, comment, anonymous_show];
                table = document.getElementById("table");
                tr = document.createElement("tr");
                context.forEach((item)=>{
                    td = document.createElement("td");
                    td.innerText = item;
                    tr.appendChild(td);
                })
                //td = document.createElement("td");

                //td.appendChild(deleteButton());
               // tr.appendChild(td);
                table.appendChild(tr);
                listOfUsers[username] = [username, name, quantity, comment, anonymous, current_username]
                document.getElementById('bonuses-to-give').lastChild.textContent = parseInt(bonuses_to_give) - parseInt(quantity);
                document.getElementById('for-entering-bonuses').value = '';
                comment = document.getElementById('comment-for-entering-bonuses').value = '';
                document.getElementById('output-select-user-to-sent-bonus').textContent = '';
                document.getElementById('select-user-to-sent-bonus').value = 'empty';
                checkBonus(document.getElementById('bonuses-to-give').lastChild.textContent);

            }
            else{
                alert("You do not have enough bonuses to send or you entered quantity incorrectly, please try again")
            }
        }
        if ((parseInt(bonuses_to_give) - parseInt(quantity)) == 0){
                alert('You used all your bonuses and now you can send it');
                document.getElementById('save-button').disabled = false;
        }
    }
    catch(err){
        alert(err.message);
    }
}

// Send to server distributed bonuses data, json
function addEntryToDb(){
    users_with_bonuses = JSON.stringify(listOfUsers);
    $.ajax({
        url : "/bonus/save/",
        type: "POST",
        data:{
            'users_with_bonuses': users_with_bonuses,
            },
        dataType: 'json',
        // handle a successful response
        success : function(jsondata) {
            alert(jsondata);
        },
        error : function(jsondata) {
            alert('Error here in json:' + jsondata);
        }
    });
    window.location.reload(true);
}

function resetOnFunctionAddEntryToDb(){

}

// Check if this user is an admin and if he can give bonuses to others
function checkUserForAdminRole(access){
    if (access === 'True'){
        document.getElementById("assign-bonuses-to-users-hidden").style.display = 'block';
        document.getElementById("assign-bonuses-to-users-button-hidden").style.display = 'block';
    }
}

// Send bonuses from the admin to the server, json
function bonusFromAdmin(){
    admin_bonus = document.getElementById("assign-bonuses-to-users").value;
    admin_bonus = JSON.stringify({'admin_bonus': admin_bonus});
    $.ajax({
        url : "/bonus/admin_bonus/",
        type: "POST",
        data:{
            'admin_bonus': admin_bonus,
            },
        dataType: 'json',
        // handle a successful response
        success : function(jsondata) {
            alert(jsondata);
        },
        error : function(jsondata) {
            alert('Error here in json:' + jsondata);
        }
    });
    window.location.reload(true);
}

// Shift
function showShift(all_bonus, shift){
    // alert(shift.id)
}