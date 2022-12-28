const fs = require('fs')
const path = require('path')
const { resolve } = require('path')
const iconv = require('iconv-lite')

let rootPath = ''
const extension = ''
const srcStr = ''
const srcEncode = 'gbk'
const destStr = ''
const destEncode = 'utf-8'

function encodeReplaceWriteFile(
  filePath,
  srcStr,
  destStr,
  srcEncode,
  destEncode
) {
  // 读取源文本的Buf
  const currentFileBuf = fs.readFileSync(filePath)

  // 将Buf编码成指定格式
  let context = iconv.decode(currentFileBuf, srcEncode)
  console.log(context);
  // 替换字符串中内容
  const data = context.replace(RegExp(srcStr, 'g'), destStr)

  // 将替换后的字符串重新编码成 gbk
  const dataBuf = iconv.encode(data, destEncode)

  // 重新写入文件
  fs.writeFileSync(filePath, dataBuf)
}
/**
 *
 * @param {string} rootPath 要修改文件的跟路径
 * @param {string} extension 指定修改文件的格式
 * @param {string} srcStr 被修改的源文本
 * @param {string} destStr 目标修改的源文本
 * @param {string} srcEncode 指定修改文件的编码格式
 * @param {string} destEncode 指定输出修改文件的编码格式
 */
function readDir(rootPath, extension) {
  const files = fs.readdirSync(rootPath)

  files.forEach((file) => {
    // 当前文件路径
    let currentFilePath = resolve(rootPath, file)

    // 拿到当前文件或文件夹的状态
    const stats = fs.statSync(currentFilePath)

    // 判断当前是否是文件夹
    if (stats.isDirectory()) {
      // 继续 recurse
      readDir(currentFilePath, extension)
    } else {
      // 当前文件路径,过滤指定的后缀名
      if (extension === path.extname(currentFilePath)) {
        encodeReplaceWriteFile(
          currentFilePath,
          srcStr,
          destStr,
          srcEncode,
          destEncode
        )
        // console.log(currentFilePath)
        // fs.renameSync(currentFilePath, currentFilePath)
      }
    }
/*         fs.stat(currentFilePath, (error, stats) => {
      if (error) throw error
      console.log(extension)

      if (stats.isDirectory()) {
        // 继续 recurse
        readDir(currentFilePath)
      } else {
        // 当前文件路径,过滤指定的后缀名
        if (extension === path.extname(currentFilePath)) {
          // 读取源文本的Buf
          const currentFileBuf = fs.readFileSync(currentFilePath)

          // 将Buf编码成指定格式
          let context = iconv.decode(currentFileBuf, srcEncode)

          // 替换字符串中内容
          const data = context.replace(
            RegExp(srcStr, 'g'),
            destStr
          )

          console.log(data)
          // 将替换后的字符串重新编码成 gbk
          const dataBuf = iconv.encode(data, destEncode)

          // 重新写入文件
          fs.writeFileSync(currentFilePath, dataBuf, (err) => {
            if (err) throw err
            console.log('The file has been saved!')
          })
        }
      }
    }) */
  })
}

readDir(rootPath, extension)
