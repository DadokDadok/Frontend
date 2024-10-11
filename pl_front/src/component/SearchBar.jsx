import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import * as React from "react";

export default function SearchBar({ value, onChange, onSearch, onKeyPress}) {
    return (
        <TextField
            variant="outlined"
            placeholder="도서관 또는 서점을 입력해주세요"
            value={value}
            onChange={onChange}
            onKeyPress={event => {
                if (event.key === 'Enter') {
                    onKeyPress(event); // 엔터 키가 눌리면 onKeyPress 호출
                }
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={onSearch}>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            fullWidth
            sx={{
                marginBottom: '16px',
                width: '90%'
            }}
        />
    );
}