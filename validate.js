// Hàm validator
function Validator(options){

    var selectorRules = {}; // nơi luu tất cả các rules vào trong obj này

        // Hàm thực hiện Validater
        function validater(inputElement,rule){
            var errorMessage;
            const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
            // lấy ra các rule của selector
            var rules = selectorRules[rule.selector]
            // dùng vòng for để lặp qua tất cả các rules
            for(var i = 0; i< rules.length; i++){
                errorMessage = rules[i](inputElement.value)
                // check nếu mà có rule lỗi thì break khỏi vòng lặp
                if(errorMessage) break;
            }
            // khi có lỗi 
            if(errorMessage){
              errorElement.innerText = errorMessage // trường có lỗi thì gắn lại text bằng message lỗi
              inputElement.parentElement.classList.add('invalid') // add màu đỏ phát hiện lỗi
            }else{
              errorElement.innerText = ''           // trường hợp không có lỗi thì trả ra 1 chuỗi rỗng
              inputElement.parentElement.classList.remove('invalid') // ko lỗi thì xóa nó đi
            }
        };
    const formElement = document.querySelector(options.form)
        if(formElement){
        options.rules.forEach(function(rule) { 
            // Lưu lại cái rule cho mỗi input

            if(Array.isArray(selectorRules[rule.selector])){
                // lần thứ 2 chạy sẽ lọt rule vào đây và push cái rule tiếp theo vào 
                selectorRules[rule.selector].push(rule.test);
            }else{
                // lần đầu tiên chạy sẽ lọt rule vào đây
                selectorRules[rule.selector] = [rule.test]
            }
           // selectorRules[rule.selector] = rule.test;
            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                // lắng nghe sự kiện bluor trỏ chuột ra ngoài
                inputElement.onblur = function(){
                    validater(inputElement, rule)
                }
            }
            // Xử lý trường hợp mỗi khi người dùng nhập vào input
            inputElement.oninput = function(){
                const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                errorElement.innerText = ''           
                inputElement.parentElement.classList.remove('invalid');
            }
        });
    }
};

// Định nghĩa các rules
// Nguyên tắc của các Rules: 
/*  - Khi có lỗi: Trả ra message lỗi
    - Khi hợp lệ: Không trả về giá trị gì
*/
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message || 'Vui lòng nhập giá trị này.'
        }
    }
}
// Validator Email
Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Không đúng định dạng Email. Vui lòng thử lại!'
        }
    }
}

// Validator Password
/*
- Kiểm tra min, max lenght giá trị nhập vào 
- Kiểm tra có chứa chữ cái đặc biệt in hoa in thường và số
- kiểm tra nhập lại mật khẩu có đúng không
- kiểm tra có trùng mật khẩu cũ trước đó ko  
*/
Validator.isPassword = function(selector, min, message){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message || `Vui lòng nhập đủ ${min} ký tự.`
        }
    }
}

Validator.isPasswordConfim = function(selector, getValueConfim, message){
    return {
        selector: selector,
        test: function(value){
            return value === getValueConfim() ? undefined : message || 'Giá trị nhập vào không chính xác!'
        }
    }
}
