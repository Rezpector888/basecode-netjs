export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

export const ORDER_CONSTANTS = [];

export const SuspiciousPatterns = [
  '<?php',
  '<?=',
  'eval(',
  'system(',
  'exec(',
  'passthru(',
  'shell_exec(',
  'popen(',
  'proc_open(',
  'base64_decode(',
  'gzinflate(',
  'gzuncompress(',
  'str_rot13(',
  'assert(',
  'create_function(',
  'include',
  'require',
  'include_once',
  'require_once',
  'file_get_contents(',
  'fopen(',
  'curl_exec(',
  'curl_multi_exec(',
  '$GLOBALS',
  '$_POST[',
  '$_GET[',
  '$HTTP_RAW_POST_DATA',
  'phpinfo(',
];
