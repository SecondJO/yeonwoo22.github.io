document.addEventListener('DOMContentLoaded', function () {
    var dropZone = document.getElementById('drop-zone');
    var fileList = document.getElementById('file-list');
    var deleteButton = document.getElementById('delete-selected');
    var toggleSelectionButton = document.getElementById('toggle-selection')
    var convertButton = document.getElementById('convert-files');
    var segmentList = document.getElementById('segment-list');

    var commonSegmentNumber = -1;

    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('hover');
    });

    dropZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('hover');
    });

    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('hover');

        var files = e.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
            if (files[i].name.endsWith('.par')) {
                addFileToList(files[i]);
            } else {
                showAlert('PAR 파일이 아닙니다.');
            }
        }
    });

    deleteButton.addEventListener('click', function () {
        var checkedBoxes = fileList.querySelectorAll('input[type="checkbox"]:checked');
        checkedBoxes.forEach(function (checkbox) {
            checkbox.parentElement.remove();
        });
    });

    toggleSelectionButton.addEventListener('click', function () {
        var files = fileList.getElementsByTagName('li');
        var allChecked = true;

        for (var i = 0; i < files.length; i++) {
            var checkbox = files[i].getElementsByTagName('input')[0];
            if (!checkbox.checked) {
                allChecked = false;
                break;
            }
        }

        for (var i = 0; i < files.length; i++) {
            var checkbox = files[i].getElementsByTagName('input')[0];
            checkbox.checked = !allChecked;
        }

        toggleSelectionButton.textContent = allChecked ? '모두 선택' : '모두 해제';

        if (allChecked) {
            toggleSelectionButton.classList.remove('toggle-selected');
            toggleSelectionButton.textContent = '모두 선택';
        } else {
            toggleSelectionButton.classList.add('toggle-selected');
            toggleSelectionButton.textContent = '모두 해제';
        }
    });

    segmentList.addEventListener('change', function(){
        console.log(this.value);

        var files = fileList.getElementsByTagName('li');
        for(var i = 0; i <files.length; i++){
            var fileSelect = files[i].getElementsByClassName('custom-select')[0];
            fileSelect.value = this.value;
        }

    });

    convertButton.addEventListener('click', async function () {
        var selectedFiles = fileList.querySelectorAll('input[type="checkbox"]:checked');
        if (selectedFiles.length === 0) {
            showAlert('변환할 파일을 선택하세요.');
            return;
        }

        var allValues  = []
        var maxRows = 0;

        for (const checkbox of selectedFiles) {
            await new Promise(function(resolve, reject){

                var fileItem = checkbox.closest('.file-item');
                var file = fileItem.file;

                var fileSelect = fileItem.getElementsByClassName('custom-select')[0];
                var optionValue = fileSelect.value;
                console.log(optionValue); 

                var reader = new FileReader();
                var localValues  = [];

                reader.onload = function (e) {
                    var content = e.target.result;

                    var segmentMatch = content.match(/<Segment1>([\s\S]*?)<\/Segment1>/);
                    if (segmentMatch && segmentMatch[0]) {
                        var lines = segmentMatch[1].split('\n');
                        lines.slice(4, -1).forEach(function(line) {
                            var parts = line.split(',');
                            if(parts.length > 4 && parts[0] == optionValue){
                                localValues.push(parts[2] + ',' + parts[3]);
                            }
                        }); 
                    }
                    allValues.push(localValues);
                    maxRows = Math.max(maxRows, localValues.length);
                    resolve();
                }
                reader.onerror = function() {
                    reject("파일 읽기 실패 :" + file.name);
                };
                reader.readAsText(file);
            });
        }

        var csvContent = "";
        for(var i = 0; i < maxRows; i++){
            var rowValues = allValues.map(function(values) {
                return values[i] || ", ";
            });
            csvContent += rowValues.join(",") + "\n";
        }
        downloadCSV(csvContent, "output.csv");
    });
    
    function downloadCSV(csvContent, fileName) {
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function updateSegmentList(maxNumber) {
        console.log(maxNumber);
        segmentList.innerHTML = '';
        for (var i = 0; i <= maxNumber; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.textContent = 'Segment#' + i;
            segmentList.appendChild(option);
        }
    }

    function addFileToList(file) {
        var li = document.createElement('li');
        li.className = 'file-item';
    
        li.file = file;
    
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        li.appendChild(checkbox);
    
        var span = document.createElement('span');
        span.className = 'file-name';
        span.textContent = file.name;
        li.appendChild(span);
    
        var reader = new FileReader();

        var selects = document.createElement("select");
        selects.className = 'custom-select';

        var segmentName = document.createElement('span');
        segmentName.textContent = 'Segment#';
        segmentName.className ='segment-name';

        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function () {
            li.remove();
        };

        reader.onload = function (e) {
            var content = e.target.result;

            var segmentMatch = content.match(/<Segment1>([\s\S]*?)<\/Segment1>/);
            if(segmentMatch && segmentMatch[0]) {

                var maxSegementNumber = -1;
                var lines = segmentMatch[1].split('\n');
                lines.slice(4, -1).forEach(function(line) {
                    
                    var values = line.split(',');
                    var segmentNumber = parseInt(values[0]);
                    if(maxSegementNumber < segmentNumber){
                        maxSegementNumber = segmentNumber;
                    }
                });
                for (var i = 0; i <= maxSegementNumber; i++){
                    var option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    selects.appendChild(option);
                }
                selects.value = maxSegementNumber;
                li.appendChild(segmentName);
                li.appendChild(selects);
                li.appendChild(deleteBtn);
            }
        }
        reader.readAsText(file);
        fileList.appendChild(li);

    }

    function showAlert(message) {
        var alertMessage = document.getElementById('alert-message');
        alertMessage.textContent = message;
        alertMessage.classList.remove('hidden');

        setTimeout(function () {
            alertMessage.classList.add('hidden');
        }, 3000);
    }

    function downloadTextFile(text, filename) {
        var blob = new Blob([text], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


});
