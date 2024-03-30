# Performance test results 

Used server: HTTP/1.1

Used computer: MacBook Pro M1

Tests were run using docker production build

### Loading main page

data_received..................: 661 MB 66 MB/s
     data_sent......................: 12 MB  1.2 MB/s
     http_req_blocked...............: avg=725ns    p(99)=5µs   
     http_req_connecting............: avg=116ns    p(99)=0s    
     http_req_duration..............: avg=637.52µs p(99)=1.63ms
       { expected_response:true }...: avg=637.52µs p(99)=1.63ms
     http_req_failed................: 0.00%  ✓ 0            ✗ 153355
     http_req_receiving.............: avg=12.55µs  p(99)=43µs  
     http_req_sending...............: avg=2.14µs   p(99)=9µs   
     http_req_tls_handshaking.......: avg=0s       p(99)=0s    
     http_req_waiting...............: avg=622.83µs p(99)=1.61ms
     http_reqs......................: 153355 15334.621326/s
     iteration_duration.............: avg=649.32µs p(99)=1.65ms
     iterations.....................: 153355 15334.621326/s
     vus............................: 10     min=10         max=10  
     vus_max........................: 10     min=10         max=10

### Posting questions 

data_received..................: 170 kB 17 kB/s
     data_sent......................: 152 kB 15 kB/s
     http_req_blocked...............: avg=6.32µs  p(99)=18.53µs 
     http_req_connecting............: avg=243ns   p(99)=0s      
     http_req_duration..............: avg=11ms    p(99)=39.79ms 
       { expected_response:true }...: avg=11ms    p(99)=39.79ms 
     http_req_failed................: 0.00%  ✓ 0         ✗ 892
     http_req_receiving.............: avg=85.66µs p(99)=278.01µs
     http_req_sending...............: avg=28.31µs p(99)=81.08µs 
     http_req_tls_handshaking.......: avg=0s      p(99)=0s      
     http_req_waiting...............: avg=10.89ms p(99)=39.69ms 
     http_reqs......................: 892    89.148641/s
     iteration_duration.............: avg=11.19ms p(99)=40.01ms 
     iterations.....................: 892    89.148641/s
     vus............................: 1      min=1       max=1
     vus_max........................: 1      min=1       max=1

### Loading questions page (with data)

data_received..................: 585 MB 59 MB/s
     data_sent......................: 12 MB  1.2 MB/s
     http_req_blocked...............: avg=764ns    p(99)=4µs   
     http_req_connecting............: avg=114ns    p(99)=0s    
     http_req_duration..............: avg=728.99µs p(99)=2.52ms
       { expected_response:true }...: avg=728.99µs p(99)=2.52ms
     http_req_failed................: 0.00%  ✓ 0            ✗ 134237
     http_req_receiving.............: avg=13.66µs  p(99)=59µs  
     http_req_sending...............: avg=2.35µs   p(99)=11µs  
     http_req_tls_handshaking.......: avg=0s       p(99)=0s    
     http_req_waiting...............: avg=712.98µs p(99)=2.48ms
     http_reqs......................: 134237 13423.148309/s
     iteration_duration.............: avg=741.95µs p(99)=2.56ms
     iterations.....................: 134237 13423.148309/s
     vus............................: 10     min=10         max=10  
     vus_max........................: 10     min=10         max=10

### Posting answers

data_received..................: 1.4 MB 137 kB/s
     data_sent......................: 1.3 MB 125 kB/s
     http_req_blocked...............: avg=3.46µs  p(99)=6µs   
     http_req_connecting............: avg=257ns   p(99)=0s    
     http_req_duration..............: avg=1.32ms  p(99)=3.5ms 
       { expected_response:true }...: avg=1.32ms  p(99)=3.5ms 
     http_req_failed................: 0.00%  ✓ 0          ✗ 7164
     http_req_receiving.............: avg=30.11µs p(99)=89µs  
     http_req_sending...............: avg=12.65µs p(99)=36µs  
     http_req_tls_handshaking.......: avg=0s      p(99)=0s    
     http_req_waiting...............: avg=1.27ms  p(99)=3.4ms 
     http_reqs......................: 7164   716.282959/s
     iteration_duration.............: avg=1.38ms  p(99)=3.71ms
     iterations.....................: 7164   716.282959/s
     vus............................: 1      min=1        max=1 
     vus_max........................: 1      min=1        max=1

### Voting question

 data_received..................: 1.3 MB 129 kB/s
     data_sent......................: 1.2 MB 116 kB/s
     http_req_blocked...............: avg=2.44µs  p(99)=7µs    
     http_req_connecting............: avg=224ns   p(99)=0s     
     http_req_duration..............: avg=1.36ms  p(99)=3.33ms 
       { expected_response:true }...: avg=1.36ms  p(99)=3.33ms 
     http_req_failed................: 0.00%  ✓ 0         ✗ 6951
     http_req_receiving.............: avg=30.9µs  p(99)=95.49µs
     http_req_sending...............: avg=11.67µs p(99)=37.49µs
     http_req_tls_handshaking.......: avg=0s      p(99)=0s     
     http_req_waiting...............: avg=1.32ms  p(99)=3.26ms 
     http_reqs......................: 6951   695.08589/s
     iteration_duration.............: avg=1.42ms  p(99)=3.59ms 
     iterations.....................: 6951   695.08589/s
     vus............................: 1      min=1       max=1 
     vus_max........................: 1      min=1       max=1