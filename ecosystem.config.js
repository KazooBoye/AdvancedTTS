module.exports = {
  apps: [{
    name: 'advanced-tts',
    script: 'server/index.js',
    cwd: '/path/to/AdvancedTTS',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    // Restart policy
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Memory management
    max_memory_restart: '500M',
    
    // Monitoring
    autorestart: true,
    watch: false,
    
    // Environment
    env_development: {
      NODE_ENV: 'development',
      PORT: 5001
    }
  }]
};
