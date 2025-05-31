let isCancelled = false;

self.onmessage = async function (e) {
    const message = e.data;

    if (!message || typeof message.type === 'undefined') {
        self.postMessage({ type: 'error', payload: 'Received message with unknown format' });
        return;
    }
    switch (message.type) {
        case 'start':
            isCancelled = false;
            const inputData = JSON.parse(message.payload);

            const sim_unit_u = inputData.Sim_Unit_U;
            const sim_unit_c = inputData.Sim_Unit_C;
            const sim_title_u = inputData.Sim_Title_U;
            const sim_title_c_pre = inputData.Sim_Title_C1;
            const sim_title_c_suf = inputData.Sim_Title_C2;
            const sim_equip1 = inputData.Sim_Equip_Type;
            const sim_equip3 = inputData.Sim_Equip3;

            const sim_setting = inputData.Sim_Setting;
            const filter_kago = inputData.Filter_Kago;
            const filter_kago_or = inputData.Filter_Kago_Or;
            const filter_slay = inputData.Filter_Slay;
            const filter_slay_or = inputData.Filter_Slay_Or;

            const is_unique = inputData.Is_Sim_Unique;
            const is_common = inputData.Is_Sim_Common;
            const can_torehan = inputData.Can_Torehan;

            const gekiha_setting = inputData.Gekiha_Setting;
            const gurume_setting = inputData.Gurume_Setting;
            const has_gekiha = inputData.Has_Gekiha;
            const has_gurume = inputData.Has_Gurume;

            const list_limit = inputData.List_Limit;

            let counter = 0;
            let count_torehan = 0;
            const result_unit_list = [];

            let skill1pow = 0;
            let skill2pow = 0;
            let skill3pow = 0;
            let skill4pow = 0;
            let skill5pow = 0;
            let skill6pow = 0;
            let skill7pow = 0;
            let skill8pow = 0;
            let skill9pow = 0;

            let filtercount = 0;
            let zeroskillcount = 0;
            let IsOK = false;

            if (is_unique) {
                for (const unit of sim_unit_u) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    if (!isCancelled) {
                        counter++;
                        self.postMessage({
                            type: 'progress',
                            payload: { currentIndex: counter }
                        });
                    }
                    for (const title of sim_title_u) {
                        if (title.NameForTitle === unit.Name || title.Name === "") {
                            for (const equip1 of sim_equip1[unit.CategoryEquip1]) {
                                for (const equip2 of sim_equip1[unit.CategoryEquip2]) {
                                    for (const equip3 of sim_equip3) {
                                        if (can_torehan && equip3.Name != "") {
                                            continue;
                                        }
                                        IsOK = false;
                                        skill1pow = 0;
                                        skill2pow = 0;
                                        skill3pow = 0;
                                        skill4pow = 0;
                                        skill5pow = 0;
                                        skill6pow = 0;
                                        skill7pow = 0;
                                        skill8pow = 0;
                                        skill9pow = 0;
                                        filtercount = 0;
                                        zeroskillcount = 0;
                                        filtercount = 0;
                                        if (filter_kago.length === 0 || filter_kago.includes("AllOn")) { IsOK = true; }
                                        else {
                                            if (filter_kago_or) {
                                                for (let i = 0; i < filter_kago.length; i++) {
                                                    if (title.TitleKago1 !== "") {
                                                        if (title.TitleKago1 === filter_kago[i]) {
                                                            IsOK = true;
                                                            break;
                                                        }
                                                    }
                                                    else if (unit.Kago1 === filter_kago[i]) {
                                                        IsOK = true;
                                                        break;
                                                    }
                                                    if (unit.Kago2 !== "") {
                                                        if (unit.Kago2 === filter_kago[i]) {
                                                            IsOK = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                if (filter_kago.length > 2) { }
                                                else if (filter_kago.length === 1) {
                                                    if (title.TitleKago1 !== "") {
                                                        if (title.TitleKago1 === filter_kago[0]) {
                                                            filtercount++;
                                                        }
                                                    }
                                                    else if (unit.Kago1 === filter_kago[0]) {
                                                        filtercount++;
                                                    }
                                                    if (unit.Kago2 !== "") {
                                                        if (unit.Kago2 === filter_kago[0]) {
                                                            filtercount++;
                                                        }
                                                    }
                                                    if (filtercount === 2) {
                                                        IsOK = true;
                                                    }
                                                }
                                                else {
                                                    for (let i = 0; i < filter_kago.length; i++) {
                                                        if (title.TitleKago1 !== "") {
                                                            if (title.TitleKago1 === filter_kago[i]) {
                                                                filtercount++;
                                                                continue;
                                                            }
                                                        }
                                                        else if (unit.Kago1 === filter_kago[i]) {
                                                            filtercount++;
                                                            continue;
                                                        }
                                                        if (unit.Kago2 !== "") {
                                                            if (unit.Kago2 === filter_kago[i]) {
                                                                filtercount++;
                                                                continue;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    if (filter_kago.length === filtercount) {
                                                        IsOK = true;
                                                    }
                                                }
                                            }
                                        }
                                        if (IsOK === false) continue;
                                        IsOK = false;
                                        filtercount = 0;
                                        if (filter_slay.length === 0 || filter_slay.includes("AllOn")) { IsOK = true; }
                                        else {
                                            if (filter_slay_or) {
                                                for (let i = 0; i < filter_slay.length; i++) {
                                                    if (filter_slay[i] === "") {
                                                        if (unit.Slay === "") {
                                                            IsOK = true;
                                                            break;
                                                        }
                                                    }
                                                    else if (unit.Slay.includes(filter_slay[i]) ||
                                                        title.TitleSlay1.includes(filter_slay[i]) ||
                                                        title.TitleSlay2.includes(filter_slay[i]) ||
                                                        equip1.EquipSlay1.includes(filter_slay[i]) ||
                                                        equip1.EquipSlay2.includes(filter_slay[i]) ||
                                                        equip2.EquipSlay1.includes(filter_slay[i]) ||
                                                        equip2.EquipSlay2.includes(filter_slay[i]) ||
                                                        equip3.EquipSlay1.includes(filter_slay[i])) {
                                                        IsOK = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            else {
                                                if (filter_slay.length === 1) {
                                                    if (filter_slay[0] === "") {
                                                        if (unit.Slay === "" &&
                                                            title.TitleSlay1 === "" && title.TitleSlay2 === "" &&
                                                            equip1.EquipSlay1 === "" && equip1.EquipSlay2 === "" &&
                                                            equip2.EquipSlay1 === "" && equip2.EquipSlay2 === "" &&
                                                            equip3.EquipSlay1 === "") {
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else {
                                                        if (unit.Slay.includes(filter_slay[0])) { filtercount++; }
                                                        if (title.TitleSlay1.includes(filter_slay[0])) { filtercount++; }
                                                        if (title.TitleSlay2.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip1.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip1.EquipSlay2.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip2.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip2.EquipSlay2.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip3.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                        if (filtercount >= 2) IsOK = true;
                                                    }
                                                }
                                                else {
                                                    for (let i = 0; i < filter_slay.length; i++) {
                                                        if (unit.Slay.includes(filter_slay[i]) ||
                                                            title.TitleSlay1.includes(filter_slay[i]) ||
                                                            title.TitleSlay2.includes(filter_slay[i]) ||
                                                            equip1.EquipSlay1.includes(filter_slay[i]) ||
                                                            equip1.EquipSlay2.includes(filter_slay[i]) ||
                                                            equip2.EquipSlay1.includes(filter_slay[i]) ||
                                                            equip2.EquipSlay2.includes(filter_slay[i]) ||
                                                            equip3.EquipSlay1.includes(filter_slay[i])) {
                                                            filtercount++;
                                                            continue;
                                                        }
                                                        break;
                                                    }
                                                    if (filter_slay.length === filtercount) {
                                                        IsOK = true;
                                                    }
                                                }
                                            }
                                        }
                                        if (IsOK === false) continue;
                                        if (has_gekiha) {
                                            const all_numbers = [];
                                            if (unit.Gekiha !== null) {
                                                for (const uni of unit.Gekiha) {
                                                    all_numbers.push(uni);
                                                }
                                            }
                                            if (title.Gekiha1 !== 0) { all_numbers.push(title.Gekiha1); }
                                            if (title.Gekiha2 !== 0) { all_numbers.push(title.Gekiha2); }
                                            if (equip1.Gekiha1 !== 0) { all_numbers.push(equip1.Gekiha1); }
                                            if (equip1.Gekiha2 !== 0) { all_numbers.push(equip1.Gekiha2); }
                                            if (equip2.Gekiha1 !== 0) { all_numbers.push(equip2.Gekiha1); }
                                            if (equip2.Gekiha2 !== 0) { all_numbers.push(equip2.Gekiha2); }
                                            if (equip3.Gekiha1 !== 0) { all_numbers.push(equip3.Gekiha1); }
                                            if (all_numbers.length === 0) { continue; }
                                            const check_power = [];
                                            const used_numbers = [];
                                            let check_count = 0;
                                            if (await checkGekihaGurume(0, all_numbers, used_numbers, check_power, gekiha_setting)) {
                                                for (let i = 0; i < 9; i++) {
                                                    if (sim_setting[i].Name === "撃破金運") {
                                                        if (i === 0) {
                                                            skill1pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 1) {
                                                            skill2pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 2) {
                                                            skill3pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 3) {
                                                            skill4pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 4) {
                                                            skill5pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 5) {
                                                            skill6pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 6) {
                                                            skill7pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 7) {
                                                            skill8pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 8) {
                                                            skill9pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                    }
                                                }
                                            }
                                            else { continue; }
                                        }
                                        if (has_gurume) {
                                            const all_numbers = [];
                                            if (unit.Gurume !== null) {
                                                for (const uni of unit.Gurume) {
                                                    all_numbers.push(uni);
                                                }
                                            }
                                            if (title.Gurume1 !== 0) { all_numbers.push(title.Gurume1); }
                                            if (title.Gurume2 !== 0) { all_numbers.push(title.Gurume2); }
                                            if (equip1.Gurume1 !== 0) { all_numbers.push(equip1.Gurume1); }
                                            if (equip1.Gurume2 !== 0) { all_numbers.push(equip1.Gurume2); }
                                            if (equip2.Gurume1 !== 0) { all_numbers.push(equip2.Gurume1); }
                                            if (equip2.Gurume2 !== 0) { all_numbers.push(equip2.Gurume2); }
                                            if (equip3.Gurume1 !== 0) { all_numbers.push(equip3.Gurume1); }
                                            if (all_numbers.length === 0) { continue; }
                                            const check_power = [];
                                            const used_numbers = [];
                                            let check_count = 0;
                                            if (await checkGekihaGurume(0, all_numbers, used_numbers, check_power, gurume_setting)) {
                                                for (let i = 0; i < 9; i++) {
                                                    if (sim_setting[i].Name === "グルメ魂") {
                                                        if (i === 0) {
                                                            skill1pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 1) {
                                                            skill2pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 2) {
                                                            skill3pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 3) {
                                                            skill4pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 4) {
                                                            skill5pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 5) {
                                                            skill6pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 6) {
                                                            skill7pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 7) {
                                                            skill8pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                        else if (i === 8) {
                                                            skill9pow = check_power[check_count];
                                                            check_count++;
                                                        }
                                                    }
                                                }
                                            }
                                            else { continue; }
                                        }
                                        for (let i = 0; i < 9; i++) {
                                            if (sim_setting[i].Name !== "") {
                                                zeroskillcount = 0;
                                                IsOK = false;
                                                if (sim_setting[i].Name === "撃破金運" || sim_setting[i].Name === "グルメ魂") {
                                                    IsOK = true;
                                                }
                                                else {
                                                    if (i === 0) {
                                                        skill1pow = unit.Skill_Pow1 + title.Skill_Pow1 + equip1.Skill_Pow1 + equip2.Skill_Pow1 + equip3.Skill_Pow1;
                                                        zeroskillcount = unit.Skill_Count1 + title.Skill_Count1 + equip1.Skill_Count1 + equip2.Skill_Count1 + equip3.Skill_Count1;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill1pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill1pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill1pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 1) {
                                                        skill2pow = unit.Skill_Pow2 + title.Skill_Pow2 + equip1.Skill_Pow2 + equip2.Skill_Pow2 + equip3.Skill_Pow2;
                                                        zeroskillcount = unit.Skill_Count2 + title.Skill_Count2 + equip1.Skill_Count2 + equip2.Skill_Count2 + equip3.Skill_Count2;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill2pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill2pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill2pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 2) {
                                                        skill3pow = unit.Skill_Pow3 + title.Skill_Pow3 + equip1.Skill_Pow3 + equip2.Skill_Pow3 + equip3.Skill_Pow3;
                                                        zeroskillcount = unit.Skill_Count3 + title.Skill_Count3 + equip1.Skill_Count3 + equip2.Skill_Count3 + equip3.Skill_Count3;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill3pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill3pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill3pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 3) {
                                                        skill4pow = unit.Skill_Pow4 + title.Skill_Pow4 + equip1.Skill_Pow4 + equip2.Skill_Pow4 + equip3.Skill_Pow4;
                                                        zeroskillcount = unit.Skill_Count4 + title.Skill_Count4 + equip1.Skill_Count4 + equip2.Skill_Count4 + equip3.Skill_Count4;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill4pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill4pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill4pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 4) {
                                                        skill5pow = unit.Skill_Pow5 + title.Skill_Pow5 + equip1.Skill_Pow5 + equip2.Skill_Pow5 + equip3.Skill_Pow5;
                                                        zeroskillcount = unit.Skill_Count5 + title.Skill_Count5 + equip1.Skill_Count5 + equip2.Skill_Count5 + equip3.Skill_Count5;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill5pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill5pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill5pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 5) {
                                                        skill6pow = unit.Skill_Pow6 + title.Skill_Pow6 + equip1.Skill_Pow6 + equip2.Skill_Pow6 + equip3.Skill_Pow6;
                                                        zeroskillcount = unit.Skill_Count6 + title.Skill_Count6 + equip1.Skill_Count6 + equip2.Skill_Count6 + equip3.Skill_Count6;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill6pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill6pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill6pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 6) {
                                                        skill7pow = unit.Skill_Pow7 + title.Skill_Pow7 + equip1.Skill_Pow7 + equip2.Skill_Pow7 + equip3.Skill_Pow7;
                                                        zeroskillcount = unit.Skill_Count7 + title.Skill_Count7 + equip1.Skill_Count7 + equip2.Skill_Count7 + equip3.Skill_Count7;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill7pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill7pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill7pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 7) {
                                                        skill8pow = unit.Skill_Pow8 + title.Skill_Pow8 + equip1.Skill_Pow8 + equip2.Skill_Pow8 + equip3.Skill_Pow8;
                                                        zeroskillcount = unit.Skill_Count8 + title.Skill_Count8 + equip1.Skill_Count8 + equip2.Skill_Count8 + equip3.Skill_Count8;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill8pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill8pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill8pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 8) {
                                                        skill9pow = unit.Skill_Pow9 + title.Skill_Pow9 + equip1.Skill_Pow9 + equip2.Skill_Pow9 + equip3.Skill_Pow9;
                                                        zeroskillcount = unit.Skill_Count9 + title.Skill_Count9 + equip1.Skill_Count9 + equip2.Skill_Count9 + equip3.Skill_Count9;
                                                        if (zeroskillcount === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill9pow === 0 && zeroskillcount > 0) { }
                                                            else {
                                                                if (skill9pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill9pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            IsOK = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (IsOK === true) {
                                            if (can_torehan) {
                                                count_torehan++;
                                                const processed_item = {
                                                    IsVisible: true,
                                                    Number: unit.Number,
                                                    ImageNumber: unit.ImageNumber,
                                                    Name: unit.Name,
                                                    TitlePrefix: title.Name,
                                                    TitleSuffix: '',
                                                    Equip1Name: equip1.Name,
                                                    Equip2Name: equip2.Name,
                                                    Equip3Name: equip3.Name,
                                                    List_Number: count_torehan,
                                                    Leader_Torehan: unit.Leader_Torehan,
                                                    Limit_Equip1: equip1.Limit,
                                                    Limit_Equip2: equip2.Limit,

                                                    SimSkill1: sim_setting[0].Name,
                                                    SimSkill2: sim_setting[1].Name,
                                                    SimSkill3: sim_setting[2].Name,
                                                    SimSkill4: sim_setting[3].Name,
                                                    SimSkill5: sim_setting[4].Name,
                                                    SimSkill6: sim_setting[5].Name,
                                                    SimSkill7: sim_setting[6].Name,
                                                    SimSkill8: sim_setting[7].Name,
                                                    SimSkill9: sim_setting[8].Name,
                                                    SimSkill1Pow: skill1pow,
                                                    SimSkill2Pow: skill2pow,
                                                    SimSkill3Pow: skill3pow,
                                                    SimSkill4Pow: skill4pow,
                                                    SimSkill5Pow: skill5pow,
                                                    SimSkill6Pow: skill6pow,
                                                    SimSkill7Pow: skill7pow,
                                                    SimSkill8Pow: skill8pow,
                                                    SimSkill9Pow: skill9pow,
                                                };
                                                result_unit_list.push(processed_item);
                                            }
                                            else {
                                                const processed_item = {
                                                    IsVisible: true,
                                                    Number: unit.Number,
                                                    ImageNumber: unit.ImageNumber,
                                                    Name: unit.Name,
                                                    TitlePrefix: title.Name,
                                                    Equip1Name: equip1.Name,
                                                    Equip2Name: equip2.Name,
                                                    Equip3Name: equip3.Name,
                                                    Limit_Equip1: equip1.Limit,
                                                    Limit_Equip2: equip2.Limit,

                                                    SimSkill1: sim_setting[0].Name,
                                                    SimSkill2: sim_setting[1].Name,
                                                    SimSkill3: sim_setting[2].Name,
                                                    SimSkill4: sim_setting[3].Name,
                                                    SimSkill5: sim_setting[4].Name,
                                                    SimSkill6: sim_setting[5].Name,
                                                    SimSkill7: sim_setting[6].Name,
                                                    SimSkill8: sim_setting[7].Name,
                                                    SimSkill9: sim_setting[8].Name,
                                                    SimSkill1Pow: skill1pow,
                                                    SimSkill2Pow: skill2pow,
                                                    SimSkill3Pow: skill3pow,
                                                    SimSkill4Pow: skill4pow,
                                                    SimSkill5Pow: skill5pow,
                                                    SimSkill6Pow: skill6pow,
                                                    SimSkill7Pow: skill7pow,
                                                    SimSkill8Pow: skill8pow,
                                                    SimSkill9Pow: skill9pow,
                                                };
                                                result_unit_list.push(processed_item);
                                            }
                                            if (result_unit_list.length > list_limit) {
                                                isCancelled = true;
                                                self.postMessage({
                                                    type: 'cancelled',
                                                    payload: { reason: 'cancelled by limit count' }
                                                });
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (is_common) {
                for (const unit of sim_unit_c) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    if (!isCancelled) {
                        counter++;
                        self.postMessage({
                            type: 'progress',
                            payload: { currentIndex: counter }
                        });
                    }
                    for (const title1 of sim_title_c_pre) {
                        if (title1.Rank <= unit.GrowthRank) {
                            for (const title2 of sim_title_c_suf) {
                                if (title2.Rank <= unit.GrowthRank) {
                                    for (const equip1 of sim_equip1[unit.CategoryEquip1]) {
                                        for (const equip2 of sim_equip1[unit.CategoryEquip2]) {
                                            for (const equip3 of sim_equip3) {
                                                if (can_torehan && equip3.Name != "") {
                                                    continue;
                                                }
                                                IsOK = false;
                                                skill1pow = 0;
                                                skill2pow = 0;
                                                skill3pow = 0;
                                                skill4pow = 0;
                                                skill5pow = 0;
                                                skill6pow = 0;
                                                skill7pow = 0;
                                                skill8pow = 0;
                                                skill9pow = 0;
                                                filtercount = 0;
                                                zeroskillcount = 0;

                                                filtercount = 0;
                                                if (filter_kago.length === 0 || filter_kago.includes("AllOn")) { IsOK = true; }
                                                else {
                                                    if (filter_kago_or) {
                                                        for (let i = 0; i < filter_kago.length; i++) {
                                                            if (title1.TitleKago1 !== "") {
                                                                if (title1.TitleKago1 === filter_kago[i]) {
                                                                    IsOK = true;
                                                                    break;
                                                                }
                                                            }
                                                            else if (unit.Kago1 === filter_kago[i]) {
                                                                IsOK = true;
                                                                break;
                                                            }
                                                            if (title2.TitleKago2 !== "") {
                                                                if (title2.TitleKago2 === filter_kago[i]) {
                                                                    IsOK = true;
                                                                    break;
                                                                }
                                                            }
                                                            else if (unit.Kago2 !== "") {
                                                                if (unit.Kago2 === filter_kago[i]) {
                                                                    IsOK = true;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (filter_kago.length > 2) { }
                                                        else if (filter_kago.length === 1) {
                                                            if (title1.TitleKago1 !== "") {
                                                                if (title1.TitleKago1 === filter_kago[0]) {
                                                                    filtercount++;
                                                                }
                                                            }
                                                            else if (unit.Kago1 === filter_kago[0]) {
                                                                filtercount++;
                                                            }
                                                            if (title2.TitleKago2 !== "") {
                                                                if (title2.TitleKago2 === filter_kago[0]) {
                                                                    filtercount++;
                                                                }
                                                            }
                                                            else if (unit.Kago2 !== "") {
                                                                if (unit.Kago2 === filter_kago[0]) {
                                                                    filtercount++;
                                                                }
                                                            }
                                                            if (filtercount === 2) {
                                                                IsOK = true;
                                                            }
                                                        }
                                                        else {
                                                            for (let i = 0; i < filter_kago.length; i++) {
                                                                if (title1.TitleKago1 !== "") {
                                                                    if (title1.TitleKago1 === filter_kago[i]) {
                                                                        filtercount++;
                                                                        continue;
                                                                    }
                                                                }
                                                                else if (unit.Kago1 === filter_kago[i]) {
                                                                    filtercount++;
                                                                    continue;
                                                                }
                                                                if (title2.TitleKago2 !== "") {
                                                                    if (title2.TitleKago2 === filter_kago[i]) {
                                                                        filtercount++;
                                                                        continue;
                                                                    }
                                                                }
                                                                else if (unit.Kago2 !== "") {
                                                                    if (unit.Kago2 === filter_kago[i]) {
                                                                        filtercount++;
                                                                        continue;
                                                                    }
                                                                }
                                                                break;
                                                            }
                                                            if (filtercount === 2) {
                                                                IsOK = true;
                                                            }
                                                        }
                                                    }
                                                }
                                                if (IsOK === false) continue;
                                                IsOK = false;
                                                filtercount = 0;
                                                if (filter_slay.length === 0 || filter_slay.includes("AllOn")) { IsOK = true; }
                                                else {
                                                    if (filter_slay_or) {
                                                        for (let i = 0; i < filter_slay.length; i++) {
                                                            if (filter_slay[i] === "") {
                                                                if (unit.Slay === "") {
                                                                    IsOK = true;
                                                                    break;
                                                                }
                                                            }
                                                            else if (unit.Slay.includes(filter_slay[i]) ||
                                                                title1.TitleSlay1.includes(filter_slay[i]) ||
                                                                title2.TitleSlay2.includes(filter_slay[i]) ||
                                                                equip1.EquipSlay1.includes(filter_slay[i]) ||
                                                                equip1.EquipSlay2.includes(filter_slay[i]) ||
                                                                equip2.EquipSlay1.includes(filter_slay[i]) ||
                                                                equip2.EquipSlay2.includes(filter_slay[i]) ||
                                                                equip3.EquipSlay1.includes(filter_slay[i])) {
                                                                IsOK = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (filter_slay.length === 1) {
                                                            if (filter_slay[0] === "") {
                                                                if (unit.Slay === "" &&
                                                                    title1.TitleSlay1 === "" && title2.TitleSlay2 === "" &&
                                                                    equip1.EquipSlay1 === "" && equip1.EquipSlay2 === "" &&
                                                                    equip2.EquipSlay1 === "" && equip2.EquipSlay2 === "" &&
                                                                    equip3.EquipSlay1 === "") {
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else {
                                                                if (unit.Slay.includes(filter_slay[0])) { filtercount++; }
                                                                if (title1.TitleSlay1.includes(filter_slay[0])) { filtercount++; }
                                                                if (title2.TitleSlay2.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip1.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip1.EquipSlay2.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip2.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip2.EquipSlay2.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip3.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                                if (filtercount >= 2) IsOK = true;
                                                            }
                                                        }
                                                        else {
                                                            for (let i = 0; i < filter_slay.length; i++) {
                                                                if (unit.Slay.includes(filter_slay[i]) ||
                                                                    title1.TitleSlay1.includes(filter_slay[i]) ||
                                                                    title2.TitleSlay2.includes(filter_slay[i]) ||
                                                                    equip1.EquipSlay1.includes(filter_slay[i]) ||
                                                                    equip1.EquipSlay2.includes(filter_slay[i]) ||
                                                                    equip2.EquipSlay1.includes(filter_slay[i]) ||
                                                                    equip2.EquipSlay2.includes(filter_slay[i]) ||
                                                                    equip3.EquipSlay1.includes(filter_slay[i])) {
                                                                    filtercount++;
                                                                    continue;
                                                                }
                                                                break;
                                                            }
                                                            if (filter_slay.length === filtercount) {
                                                                IsOK = true;
                                                            }
                                                        }
                                                    }
                                                }
                                                if (IsOK === false) continue;
                                                if (has_gekiha) {
                                                    const all_numbers = [];
                                                    if (unit.Gekiha !== null) {
                                                        for (const uni of unit.Gekiha) {
                                                            all_numbers.push(uni);
                                                        }
                                                    }
                                                    if (title1.Gekiha1 !== 0) { all_numbers.push(title1.Gekiha1); }
                                                    if (title2.Gekiha2 !== 0) { all_numbers.push(title2.Gekiha2); }
                                                    if (equip1.Gekiha1 !== 0) { all_numbers.push(equip1.Gekiha1); }
                                                    if (equip1.Gekiha2 !== 0) { all_numbers.push(equip1.Gekiha2); }
                                                    if (equip2.Gekiha1 !== 0) { all_numbers.push(equip2.Gekiha1); }
                                                    if (equip2.Gekiha2 !== 0) { all_numbers.push(equip2.Gekiha2); }
                                                    if (equip3.Gekiha1 !== 0) { all_numbers.push(equip3.Gekiha1); }
                                                    if (all_numbers.length === 0) { continue; }
                                                    const check_power = [];
                                                    const used_numbers = [];
                                                    let check_count = 0;
                                                    if (await checkGekihaGurume(0, all_numbers, used_numbers, check_power, gekiha_setting)) {
                                                        for (let i = 0; i < 9; i++) {
                                                            if (sim_setting[i].Name === "撃破金運") {
                                                                if (i === 0) {
                                                                    skill1pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 1) {
                                                                    skill2pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 2) {
                                                                    skill3pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 3) {
                                                                    skill4pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 4) {
                                                                    skill5pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 5) {
                                                                    skill6pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 6) {
                                                                    skill7pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 7) {
                                                                    skill8pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 8) {
                                                                    skill9pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else { continue; }
                                                }
                                                if (has_gurume) {
                                                    const all_numbers = [];
                                                    if (unit.Gurume !== null) {
                                                        for (const uni of unit.Gurume) {
                                                            all_numbers.push(uni);
                                                        }
                                                    }
                                                    if (title1.Gurume1 !== 0) { all_numbers.push(title1.Gurume1); }
                                                    if (title2.Gurume2 !== 0) { all_numbers.push(title2.Gurume2); }
                                                    if (equip1.Gurume1 !== 0) { all_numbers.push(equip1.Gurume1); }
                                                    if (equip1.Gurume2 !== 0) { all_numbers.push(equip1.Gurume2); }
                                                    if (equip2.Gurume1 !== 0) { all_numbers.push(equip2.Gurume1); }
                                                    if (equip2.Gurume2 !== 0) { all_numbers.push(equip2.Gurume2); }
                                                    if (equip3.Gurume1 !== 0) { all_numbers.push(equip3.Gurume1); }
                                                    if (all_numbers.length === 0) { continue; }
                                                    const check_power = [];
                                                    const used_numbers = [];
                                                    let check_count = 0;
                                                    if (await checkGekihaGurume(0, all_numbers, used_numbers, check_power, gurume_setting)) {
                                                        for (let i = 0; i < 9; i++) {
                                                            if (sim_setting[i].Name === "グルメ魂") {
                                                                if (i === 0) {
                                                                    skill1pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 1) {
                                                                    skill2pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 2) {
                                                                    skill3pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 3) {
                                                                    skill4pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 4) {
                                                                    skill5pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 5) {
                                                                    skill6pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 6) {
                                                                    skill7pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 7) {
                                                                    skill8pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                                else if (i === 8) {
                                                                    skill9pow = check_power[check_count];
                                                                    check_count++;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else { continue; }
                                                }

                                                for (let i = 0; i < 9; i++) {
                                                    if (sim_setting[i].Name !== "") {
                                                        zeroskillcount = 0;
                                                        IsOK = false;
                                                        if (sim_setting[i].Name === "撃破金運" || sim_setting[i].Name === "グルメ魂") {
                                                            IsOK = true;
                                                        }
                                                        else {
                                                            if (i === 0) {
                                                                skill1pow = unit.Skill_Pow1 + title1.Skill_Pow1 + title2.Skill_Pow1 + equip1.Skill_Pow1 + equip2.Skill_Pow1 + equip3.Skill_Pow1;
                                                                zeroskillcount = unit.Skill_Count1 + title1.Skill_Count1 + title2.Skill_Count1 + equip1.Skill_Count1 + equip2.Skill_Count1 + equip3.Skill_Count1;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill1pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill1pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill1pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else if (i === 1) {
                                                                skill2pow = unit.Skill_Pow2 + title1.Skill_Pow2 + title2.Skill_Pow2 + equip1.Skill_Pow2 + equip2.Skill_Pow2 + equip3.Skill_Pow2;
                                                                zeroskillcount = unit.Skill_Count2 + title1.Skill_Count2 + title2.Skill_Count2 + equip1.Skill_Count2 + equip2.Skill_Count2 + equip3.Skill_Count2;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill2pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill2pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill2pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else if (i === 2) {
                                                                skill3pow = unit.Skill_Pow3 + title1.Skill_Pow3 + title2.Skill_Pow3 + equip1.Skill_Pow3 + equip2.Skill_Pow3 + equip3.Skill_Pow3;
                                                                zeroskillcount = unit.Skill_Count3 + title1.Skill_Count3 + title2.Skill_Count3 + equip1.Skill_Count3 + equip2.Skill_Count3 + equip3.Skill_Count3;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill3pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill3pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill3pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else if (i === 3) {
                                                                skill4pow = unit.Skill_Pow4 + title1.Skill_Pow4 + title2.Skill_Pow4 + equip1.Skill_Pow4 + equip2.Skill_Pow4 + equip3.Skill_Pow4;
                                                                zeroskillcount = unit.Skill_Count4 + title1.Skill_Count4 + title2.Skill_Count4 + equip1.Skill_Count4 + equip2.Skill_Count4 + equip3.Skill_Count4;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill4pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill4pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill4pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else if (i === 4) {
                                                                skill5pow = unit.Skill_Pow5 + title1.Skill_Pow5 + title2.Skill_Pow5 + equip1.Skill_Pow5 + equip2.Skill_Pow5 + equip3.Skill_Pow5;
                                                                zeroskillcount = unit.Skill_Count5 + title1.Skill_Count5 + title2.Skill_Count5 + equip1.Skill_Count5 + equip2.Skill_Count5 + equip3.Skill_Count5;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill5pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill5pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill5pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else if (i === 5) {
                                                                skill6pow = unit.Skill_Pow6 + title1.Skill_Pow6 + title2.Skill_Pow6 + equip1.Skill_Pow6 + equip2.Skill_Pow6 + equip3.Skill_Pow6;
                                                                zeroskillcount = unit.Skill_Count6 + title1.Skill_Count6 + title2.Skill_Count6 + equip1.Skill_Count6 + equip2.Skill_Count6 + equip3.Skill_Count6;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill6pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill6pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill6pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else if (i === 6) {
                                                                skill7pow = unit.Skill_Pow7 + title1.Skill_Pow7 + title2.Skill_Pow7 + equip1.Skill_Pow7 + equip2.Skill_Pow7 + equip3.Skill_Pow7;
                                                                zeroskillcount = unit.Skill_Count7 + title1.Skill_Count7 + title2.Skill_Count7 + equip1.Skill_Count7 + equip2.Skill_Count7 + equip3.Skill_Count7;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill7pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill7pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill7pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else if (i === 7) {
                                                                skill8pow = unit.Skill_Pow8 + title1.Skill_Pow8 + title2.Skill_Pow8 + equip1.Skill_Pow8 + equip2.Skill_Pow8 + equip3.Skill_Pow8;
                                                                zeroskillcount = unit.Skill_Count8 + title1.Skill_Count8 + title2.Skill_Count8 + equip1.Skill_Count8 + equip2.Skill_Count8 + equip3.Skill_Count8;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill8pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill8pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill8pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else if (i === 8) {
                                                                skill9pow = unit.Skill_Pow9 + title1.Skill_Pow9 + title2.Skill_Pow9 + equip1.Skill_Pow9 + equip2.Skill_Pow9 + equip3.Skill_Pow9;
                                                                zeroskillcount = unit.Skill_Count9 + title1.Skill_Count9 + title2.Skill_Count9 + equip1.Skill_Count9 + equip2.Skill_Count9 + equip3.Skill_Count9;
                                                                if (zeroskillcount === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill9pow === 0 && zeroskillcount > 0) { }
                                                                    else {
                                                                        if (skill9pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill9pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (IsOK === true) {
                                                    if (can_torehan) {
                                                        count_torehan++;
                                                        const processed_item = {
                                                            IsVisible: true,
                                                            Number: unit.Number,
                                                            ImageNumber: unit.ImageNumber,
                                                            Name: unit.Name,
                                                            TitlePrefix: title1.Name,
                                                            TitleSuffix: title2.Name,
                                                            Equip1Name: equip1.Name,
                                                            Equip2Name: equip2.Name,
                                                            Equip3Name: equip3.Name,
                                                            List_Number: count_torehan,
                                                            Leader_Torehan: unit.Leader_Torehan,
                                                            Limit_Equip1: equip1.Limit,
                                                            Limit_Equip2: equip2.Limit,

                                                            SimSkill1: sim_setting[0].Name,
                                                            SimSkill2: sim_setting[1].Name,
                                                            SimSkill3: sim_setting[2].Name,
                                                            SimSkill4: sim_setting[3].Name,
                                                            SimSkill5: sim_setting[4].Name,
                                                            SimSkill6: sim_setting[5].Name,
                                                            SimSkill7: sim_setting[6].Name,
                                                            SimSkill8: sim_setting[7].Name,
                                                            SimSkill9: sim_setting[8].Name,
                                                            SimSkill1Pow: skill1pow,
                                                            SimSkill2Pow: skill2pow,
                                                            SimSkill3Pow: skill3pow,
                                                            SimSkill4Pow: skill4pow,
                                                            SimSkill5Pow: skill5pow,
                                                            SimSkill6Pow: skill6pow,
                                                            SimSkill7Pow: skill7pow,
                                                            SimSkill8Pow: skill8pow,
                                                            SimSkill9Pow: skill9pow,
                                                        };
                                                        result_unit_list.push(processed_item);
                                                    }
                                                    else {
                                                        const processed_item = {
                                                            IsVisible: true,
                                                            Number: unit.Number,
                                                            ImageNumber: unit.ImageNumber,
                                                            Name: unit.Name,
                                                            TitlePrefix: title1.Name,
                                                            TitleSuffix: title2.Name,
                                                            Equip1Name: equip1.Name,
                                                            Equip2Name: equip2.Name,
                                                            Equip3Name: equip3.Name,
                                                            Limit_Equip1: equip1.Limit,
                                                            Limit_Equip2: equip2.Limit,

                                                            SimSkill1: sim_setting[0].Name,
                                                            SimSkill2: sim_setting[1].Name,
                                                            SimSkill3: sim_setting[2].Name,
                                                            SimSkill4: sim_setting[3].Name,
                                                            SimSkill5: sim_setting[4].Name,
                                                            SimSkill6: sim_setting[5].Name,
                                                            SimSkill7: sim_setting[6].Name,
                                                            SimSkill8: sim_setting[7].Name,
                                                            SimSkill9: sim_setting[8].Name,
                                                            SimSkill1Pow: skill1pow,
                                                            SimSkill2Pow: skill2pow,
                                                            SimSkill3Pow: skill3pow,
                                                            SimSkill4Pow: skill4pow,
                                                            SimSkill5Pow: skill5pow,
                                                            SimSkill6Pow: skill6pow,
                                                            SimSkill7Pow: skill7pow,
                                                            SimSkill8Pow: skill8pow,
                                                            SimSkill9Pow: skill9pow,
                                                        };
                                                        result_unit_list.push(processed_item);
                                                    }

                                                    if (result_unit_list.length > list_limit) {
                                                        isCancelled = true;
                                                        self.postMessage({
                                                            type: 'cancelled',
                                                            payload: { reason: `${result_unit_list.length}体` }                                                     
                                                        });
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (can_torehan) {
                await new Promise(resolve => setTimeout(resolve, 1));
                self.postMessage({
                    type: 'preresult',
                    payload: { message: '編成中' }
                });
                await new Promise(resolve => setTimeout(resolve, 1));

                const result_torehan_party_list = await testTorehan(result_unit_list, list_limit);
                if (result_torehan_party_list == null) {
                    isCancelled = true;
                    self.postMessage({
                        type: 'cancelled',
                        payload: { reason: `6体揃いませんでした。` }
                    });
                    return;
                }
                if (result_torehan_party_list.length > list_limit / 10) {
                    isCancelled = true;
                    self.postMessage({
                        type: 'cancelled',
                        payload: { reason: `${result_torehan_party_list.length}師団` }
                    });
                    return;
                }

                if (!isCancelled) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    self.postMessage({
                        type: 'preresult',
                        payload: { message: '最終処理中' }
                    });
                    await new Promise(resolve => setTimeout(resolve, 1));

                    self.postMessage({
                        type: 'torehan',
                        payload: result_torehan_party_list
                    });
                }
            }
            else {
                if (!isCancelled) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    self.postMessage({
                        type: 'preresult',
                        payload: { message: '最終処理中' }
                    });
                    await new Promise(resolve => setTimeout(resolve, 1));

                    self.postMessage({
                        type: 'result',
                        payload: result_unit_list
                    });
                }

            }

        case 'cancel':
            isCancelled = true;
            break;

        default:
            self.postMessage({ type: 'error', payload: `Received message with unhandled type: ${message.type}` });
            break;
    }
};

self.onerror = function (e) {
    self.postMessage({
        type: 'error',
        payload: e.message || 'Unknown worker error'
    });
};


async function testTorehan(result_list, list_limit) {
    result_list.sort((a, b) => b.SimSkill1Pow - a.SimSkill1Pow);

    let names = [];
    let name_list = [];
    for (const unit of result_list) {
        if (unit.Leader_Torehan > 0) {
            if (!names.includes(unit.Name)) {
                names.push(unit.Name);
                name_list.push([unit.Name, unit.TitlePrefix, unit.TitleSuffix]);
                if (name_list.length === 10) {
                    break;
                }
            }
        }
    }
    if (names.length === 0) {
        return null;
    }
    const leaders = [];
    for (const unit of name_list) {
        let count_name = 0;
        let count = 0;
        for (const uni of result_list) {
            if (uni.Name === unit[count_name]) {
                if (uni.TitlePrefix === unit[count_name + 1] && uni.TitleSuffix === unit[count_name + 2]) {
                    count++;
                    leaders.push(uni);
                    if (count === 10) {
                        count_name++;
                        break;
                    }
                }
            }
        }
    }    result_list.sort((a, b) => (b.SimSkill1Pow - b.Leader_Torehan) - (a.SimSkill1Pow - a.Leader_Torehan));

    names = [];
    name_list = [];
    for (const unit of result_list) {
        if (!names.includes(unit.Name)) {
            names.push(unit.Name);
            name_list.push([unit.Name, unit.TitlePrefix, unit.TitleSuffix]);
            if (name_list.length === 30) {
                break;
            }
        }
    }
    if (names.length < 6) {
        return null;
    }
    let members = [];
    for (const unit of name_list) {
        let count_name = 0;
        let count = 0;
        for (const uni of result_list) {
            if (uni.Name === unit[count_name]) {
                if (uni.TitlePrefix === unit[count_name + 1] && uni.TitleSuffix === unit[count_name + 2]) {
                    count++;
                    members.push(uni);
                    if (count === 10) {
                        count_name++;
                        break;
                    }
                }
            }
        }
    }

    const limit_equip_list = [];
    const temp_limit = [];
    let highest_pow = 0;
    let temp_pow = 0;

    const temp_members = [];

    for (const u1 of leaders) {
        for (const u2 of members) {
            if (u1.Name === u2.Name) continue;            
            if (u2.Number < 200) { if (Math.abs(u2.Number - u1.Number) <= 2) { continue; } }
            //#region u2
            limit_equip_list[0] = u1.Limit_Equip1;
            limit_equip_list[1] = u1.Limit_Equip2;

            if (u2.Equip1Name === u1.Equip1Name || u2.Equip2Name === u1.Equip1Name) { limit_equip_list[0]--; }
            if (u2.Equip1Name === u1.Equip2Name || u2.Equip2Name === u1.Equip2Name) { limit_equip_list[1]--; }
            if (limit_equip_list.some(x => x < 1)) { continue; }
            temp_limit[0] = limit_equip_list[0];
            temp_limit[1] = limit_equip_list[1];

            //#endregion
            for (const u3 of members) {
                if (u3.Name === u1.Name || u3.Name === u2.Name) continue;
                if (u3.Number < 200) {
                    if (Math.abs(u3.Number - u1.Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u3.Number - u2.Number) <= 2) {
                        continue;
                    }
                }
                //#region u3
                limit_equip_list[2] = u2.Limit_Equip1;
                limit_equip_list[3] = u2.Limit_Equip2;

                if (u3.Equip1Name === u1.Equip1Name || u3.Equip2Name === u1.Equip1Name) { limit_equip_list[0]--; }
                if (u3.Equip1Name === u1.Equip2Name || u3.Equip2Name === u1.Equip2Name) { limit_equip_list[1]--; }
                if (u3.Equip1Name === u2.Equip1Name || u3.Equip2Name === u2.Equip1Name) { limit_equip_list[2]--; }
                if (u3.Equip1Name === u2.Equip2Name || u3.Equip2Name === u2.Equip2Name) { limit_equip_list[3]--; }
                if (limit_equip_list.some(x => x < 1)) {
                    limit_equip_list[0] = temp_limit[0];
                    limit_equip_list[1] = temp_limit[1];
                    continue;
                }
                temp_limit[0] = limit_equip_list[0];
                temp_limit[1] = limit_equip_list[1];
                temp_limit[2] = limit_equip_list[2];
                temp_limit[3] = limit_equip_list[3];
                //#endregion
                for (const u4 of members) {
                    if (u4.Name === u1.Name || u4.Name === u2.Name || u4.Name === u3.Name) continue;
                    if (u4.Number < 200) {
                        if (Math.abs(u4.Number - u1.Number) <= 2) {
                            continue;
                        }
                        if (Math.abs(u4.Number - u2.Number) <= 2) {
                            continue;
                        }
                        if (Math.abs(u4.Number - u3.Number) <= 2) {
                            continue;
                        }
                    }
                    //#region u4
                    limit_equip_list[4] = u3.Limit_Equip1;
                    limit_equip_list[5] = u3.Limit_Equip2;

                    if (u4.Equip1Name === u1.Equip1Name || u4.Equip2Name === u1.Equip1Name) { limit_equip_list[0]--; }
                    if (u4.Equip1Name === u1.Equip2Name || u4.Equip2Name === u1.Equip2Name) { limit_equip_list[1]--; }
                    if (u4.Equip1Name === u2.Equip1Name || u4.Equip2Name === u2.Equip1Name) { limit_equip_list[2]--; }
                    if (u4.Equip1Name === u2.Equip2Name || u4.Equip2Name === u2.Equip2Name) { limit_equip_list[3]--; }
                    if (u4.Equip1Name === u3.Equip1Name || u4.Equip2Name === u3.Equip1Name) { limit_equip_list[4]--; }
                    if (u4.Equip1Name === u3.Equip2Name || u4.Equip2Name === u3.Equip2Name) { limit_equip_list[5]--; }
                    if (limit_equip_list.some(x => x < 1)) {
                        limit_equip_list[0] = temp_limit[0];
                        limit_equip_list[1] = temp_limit[1];
                        limit_equip_list[2] = temp_limit[2];
                        limit_equip_list[3] = temp_limit[3];
                        continue;
                    }
                    //#endregion                  
                    temp_pow = u1.SimSkill1Pow + u2.SimSkill1Pow - u2.Leader_Torehan +
                        u3.SimSkill1Pow - u3.Leader_Torehan + u4.SimSkill1Pow - u4.Leader_Torehan;
                    if (temp_pow >= highest_pow) {
                        highest_pow = temp_pow;
                        temp_members.push([temp_pow, u1, u2, u3, u4]);
                    }
                }
            }
        }
    }
    names = [];
    name_list = [];
    for (const unit of result_list) {
        if (!names.includes(unit.Name)) {
            names.push(unit.Name);
            name_list.push([unit.Name, unit.TitlePrefix, unit.TitleSuffix]);
            if (name_list.length === 50) {
                break;
            }
        }
    }
    members = [];
    for (const unit of name_list) {
        let count_name = 0;
        let count = 0;
        for (const uni of result_list) {
            if (uni.Name === unit[count_name]) {
                if (uni.TitlePrefix === unit[count_name + 1] && uni.TitleSuffix === unit[count_name + 2]) {
                    count++;
                    members.push(uni);
                    if (count === 20) {
                        count_name++;
                        break;
                    }
                }
            }
        }
    }
    const temp_party = [];
    for (const pre of temp_members) {
        //#region 準備
        limit_equip_list[0] = pre[1].Limit_Equip1;
        limit_equip_list[1] = pre[1].Limit_Equip2;
        limit_equip_list[2] = pre[2].Limit_Equip1;
        limit_equip_list[3] = pre[2].Limit_Equip2;
        limit_equip_list[4] = pre[3].Limit_Equip1;
        limit_equip_list[5] = pre[3].Limit_Equip2;

        if (pre[2].Equip1Name === pre[1].Equip1Name || pre[2].Equip2Name === pre[1].Equip1Name) { limit_equip_list[0]--; }
        if (pre[2].Equip1Name === pre[1].Equip2Name || pre[2].Equip2Name === pre[1].Equip2Name) { limit_equip_list[1]--; }

        if (pre[3].Equip1Name === pre[1].Equip1Name || pre[3].Equip2Name === pre[1].Equip1Name) { limit_equip_list[0]--; }
        if (pre[3].Equip1Name === pre[1].Equip2Name || pre[3].Equip2Name === pre[1].Equip2Name) { limit_equip_list[1]--; }
        if (pre[3].Equip1Name === pre[2].Equip1Name || pre[3].Equip2Name === pre[2].Equip1Name) { limit_equip_list[2]--; }
        if (pre[3].Equip1Name === pre[2].Equip2Name || pre[3].Equip2Name === pre[2].Equip2Name) { limit_equip_list[3]--; }

        if (pre[4].Equip1Name === pre[1].Equip1Name || pre[4].Equip2Name === pre[1].Equip1Name) { limit_equip_list[0]--; }
        if (pre[4].Equip1Name === pre[1].Equip2Name || pre[4].Equip2Name === pre[1].Equip2Name) { limit_equip_list[1]--; }
        if (pre[4].Equip1Name === pre[2].Equip1Name || pre[4].Equip2Name === pre[2].Equip1Name) { limit_equip_list[2]--; }
        if (pre[4].Equip1Name === pre[2].Equip2Name || pre[4].Equip2Name === pre[2].Equip2Name) { limit_equip_list[3]--; }
        if (pre[4].Equip1Name === pre[3].Equip1Name || pre[4].Equip2Name === pre[3].Equip1Name) { limit_equip_list[4]--; }
        if (pre[4].Equip1Name === pre[3].Equip2Name || pre[4].Equip2Name === pre[3].Equip2Name) { limit_equip_list[5]--; }

        temp_limit[0] = limit_equip_list[0];
        temp_limit[1] = limit_equip_list[1];
        temp_limit[2] = limit_equip_list[2];
        temp_limit[3] = limit_equip_list[3];
        temp_limit[4] = limit_equip_list[4];
        temp_limit[5] = limit_equip_list[5];
        //#endregion

        for (const u5 of members) {
            if (u5.Name === pre[1].Name || u5.Name === pre[2].Name || u5.Name === pre[3].Name || u5.Name === pre[4].Name) { continue; }
            if (u5.Number < 200) {
                if (Math.abs(u5.Number - pre[1].Number) <= 2) {
                    continue;
                }
                if (Math.abs(u5.Number - pre[2].Number) <= 2) {
                    continue;
                }
                if (Math.abs(u5.Number - pre[3].Number) <= 2) {
                    continue;
                }
                if (Math.abs(u5.Number - pre[4].Number) <= 2) {
                    continue;
                }
            }
            //#region u5
            limit_equip_list[6] = pre[4].Limit_Equip1;
            limit_equip_list[7] = pre[4].Limit_Equip2;

            if (u5.Equip1Name === pre[1].Equip1Name || u5.Equip2Name === pre[1].Equip1Name) { limit_equip_list[0]--; }
            if (u5.Equip1Name === pre[1].Equip2Name || u5.Equip2Name === pre[1].Equip2Name) { limit_equip_list[1]--; }
            if (u5.Equip1Name === pre[2].Equip1Name || u5.Equip2Name === pre[2].Equip1Name) { limit_equip_list[2]--; }
            if (u5.Equip1Name === pre[2].Equip2Name || u5.Equip2Name === pre[2].Equip2Name) { limit_equip_list[3]--; }
            if (u5.Equip1Name === pre[3].Equip1Name || u5.Equip2Name === pre[3].Equip1Name) { limit_equip_list[4]--; }
            if (u5.Equip1Name === pre[3].Equip2Name || u5.Equip2Name === pre[3].Equip2Name) { limit_equip_list[5]--; }
            if (u5.Equip1Name === pre[4].Equip1Name || u5.Equip2Name === pre[4].Equip1Name) { limit_equip_list[6]--; }
            if (u5.Equip1Name === pre[4].Equip2Name || u5.Equip2Name === pre[4].Equip2Name) { limit_equip_list[7]--; }

            if (limit_equip_list.some(x => x < 1)) {
                limit_equip_list[0] = temp_limit[0];
                limit_equip_list[1] = temp_limit[1];
                limit_equip_list[2] = temp_limit[2];
                limit_equip_list[3] = temp_limit[3];
                limit_equip_list[4] = temp_limit[4];
                limit_equip_list[5] = temp_limit[5];
                continue;
            }
            temp_limit[0] = limit_equip_list[0];
            temp_limit[1] = limit_equip_list[1];
            temp_limit[2] = limit_equip_list[2];
            temp_limit[3] = limit_equip_list[3];
            temp_limit[4] = limit_equip_list[4];
            temp_limit[5] = limit_equip_list[5];
            temp_limit[6] = limit_equip_list[6];
            temp_limit[7] = limit_equip_list[7];
            //#endregion
            for (const u6 of members) {
                if (u6.Name === pre[1].Name || u6.Name === pre[2].Name || u6.Name === pre[3].Name ||
                    u6.Name === pre[4].Name || u6.Name === u5.Name) { continue; }
                if (u6.Number < 200) {
                    if (Math.abs(u6.Number - pre[1].Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u6.Number - pre[2].Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u6.Number - pre[3].Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u6.Number - pre[4].Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u6.Number - u5.Number) <= 2) {
                        continue;
                    }
                }
                //#region u6
                limit_equip_list[8] = u5.Limit_Equip1;
                limit_equip_list[9] = u5.Limit_Equip2;

                if (u6.Equip1Name === pre[1].Equip1Name || u6.Equip2Name === pre[1].Equip1Name) { limit_equip_list[0]--; }
                if (u6.Equip1Name === pre[1].Equip2Name || u6.Equip2Name === pre[1].Equip2Name) { limit_equip_list[1]--; }
                if (u6.Equip1Name === pre[2].Equip1Name || u6.Equip2Name === pre[2].Equip1Name) { limit_equip_list[2]--; }
                if (u6.Equip1Name === pre[2].Equip2Name || u6.Equip2Name === pre[2].Equip2Name) { limit_equip_list[3]--; }
                if (u6.Equip1Name === pre[3].Equip1Name || u6.Equip2Name === pre[3].Equip1Name) { limit_equip_list[4]--; }
                if (u6.Equip1Name === pre[3].Equip2Name || u6.Equip2Name === pre[3].Equip2Name) { limit_equip_list[5]--; }
                if (u6.Equip1Name === pre[4].Equip1Name || u6.Equip2Name === pre[4].Equip1Name) { limit_equip_list[6]--; }
                if (u6.Equip1Name === pre[4].Equip2Name || u6.Equip2Name === pre[4].Equip2Name) { limit_equip_list[7]--; }
                if (u6.Equip1Name === u5.Equip1Name || u6.Equip2Name === u5.Equip1Name) { limit_equip_list[8]--; }
                if (u6.Equip1Name === u5.Equip2Name || u6.Equip2Name === u5.Equip2Name) { limit_equip_list[9]--; }

                if (limit_equip_list.some(x => x < 1)) {
                    limit_equip_list[0] = temp_limit[0];
                    limit_equip_list[1] = temp_limit[1];
                    limit_equip_list[2] = temp_limit[2];
                    limit_equip_list[3] = temp_limit[3];
                    limit_equip_list[4] = temp_limit[4];
                    limit_equip_list[5] = temp_limit[5];
                    limit_equip_list[6] = temp_limit[6];
                    limit_equip_list[7] = temp_limit[7];
                    continue;
                }
                //#endregion
                temp_pow = pre[1].SimSkill1Pow + pre[2].SimSkill1Pow - pre[2].Leader_Torehan +
                    pre[3].SimSkill1Pow - pre[3].Leader_Torehan + pre[4].SimSkill1Pow - pre[4].Leader_Torehan +
                    u5.SimSkill1Pow - u5.Leader_Torehan + u6.SimSkill1Pow - u6.Leader_Torehan;

                if (temp_pow >= highest_pow) {
                    highest_pow = temp_pow;
                    temp_party.push([temp_pow, pre[1].List_Number, pre[2].List_Number, pre[3].List_Number,
                        pre[4].List_Number, u5.List_Number, u6.List_Number]);
                }
            }
        }
    }

    if (temp_party.length === 0) {
        return null;
    }
    let result = [];
    for (const party of temp_party) {
        if (party[0] === highest_pow) {
            result.push(party);
        }
    }
    if (result.length > list_limit / 10) {
        return result;
    }
    const checked_list_map = new Map();
    for (const item of result) {
        const pow = item[0];
        const leader = item[1];
        const members = item.slice(2).sort();
        const key = `${pow},${leader},${members.join(',')}`;
        if (!checked_list_map.has(key)) {
            checked_list_map.set(key, item);
        }
    }
    result = Array.from(checked_list_map.values());

    const last_result_list = [];
    for (const item of result) {
        for (const u1 of leaders) {
            if (item[1] == u1.List_Number) {
                for (const u2 of members) {
                    if (item[2] == u2.List_Number) {
                        for (const u3 of members) {
                            if (item[3] == u3.List_Number) {
                                for (const u4 of members) {
                                    if (item[4] == u4.List_Number) {
                                        for (const u5 of members) {
                                            if (item[5] == u5.List_Number) {
                                                for (const u6 of members) {
                                                    if (item[6] == u6.List_Number) {
                                                        const list = {
                                                            "TotalPow": item[0],
                                                            "Unit_1": u1,
                                                            "Unit_2": u2,
                                                            "Unit_3": u3,
                                                            "Unit_4": u4,
                                                            "Unit_5": u5,
                                                            "Unit_6": u6,
                                                        };
                                                        last_result_list.push(list);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return last_result_list;
}

async function checkGekihaGurume(check_index, all_numbers, used_numbers, check_power, setting) {
    if (check_index === setting.length) {
        return true;
    }
    const current_min = setting[check_index].Min;
    const current_max = setting[check_index].Max;

    for (let i = 0; i < all_numbers.length; i++) {
        if (!used_numbers[i] &&
            all_numbers[i] >= current_min &&
            all_numbers[i] <= current_max) {
            used_numbers[i] = true;
            check_power.push(all_numbers[i]);
            if (await checkGekihaGurume(check_index + 1, all_numbers, used_numbers, check_power, setting)) {
                return true;
            }
            used_numbers[i] = false;
            check_power.pop();
        }
    }
    return false;
}
